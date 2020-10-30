import { Box } from 'theme-ui'

## Summary

These maps —built In collaboration between CarbonPlan and a team of researchers — show the potential carbon removal associated with forest growth and risks to forest carbon loss across the continental US (current) and Alaska (still in development). All quantities are estimated based on historical data and then projected into the future using data generated from climate models. Model predictions are harmonized to a common resolution of 4km to match available gridded climate observations.

## Contributors

These data products and the website were developed jointly by the following contributors (in alphabetical order): Bill Anderegg (University of Utah), Grayson Badgley (Black Rock Forest / Columbia University), Oriana Chegwidden (CarbonPlan), Jeremy Freeman (CarbonPlan), Joe Hamman (CarbonPlan), Jake Mensch, Anna Trugman (UC Santa Barbara)

## Usage

In the sidebar on the left you can click to turn different layers on and off, and select different climate scenarios. For each selection, the results reflect an ensemble average of several climate models for that scenario. You can expand the legend to see color bars and scales for each layer. By clicking the magnifying glass, you can bring up a circular focus window. Dragging that around allows you to see regional statistics with further explanation of the layers.

## Methods

Here, we briefly describe how we built the biomass map and the risk maps for fire, drought mortality, insect mortality, and net biophysical feedbacks. These maps are based on several datasets, including in-situ observations and downscaled climate model scenarios, that are described below. All the input data is available in public cloud storage (see below), and Python code for reproducing these analyses from those data is available on [Github](https://github.com/carbonplan/forests). Several Jupyter notebooks are available documenting different aspects of the analysis and are referenced below. We expect to continue to iterate and improve these models over time and will update our code and the description of these methods accordingly.

### Biomass

We developed a statistical model relating forest stand age to biomass, in order to project future biomass under assumptions of historical growth trends. Our approach was inspired by and is similar to that of Zhu et al. (2018), with some differences in model and variable specifications.

The model was fit to historical data from the US Forest Service Forest Inventory Analysis long-term permanent plot network (Gillespie 1999). We aggregated data from individual trees to “conditions,” each of which represents a portion of a plot with similar land cover class types, size classes, and other distinguishing characteristics. We screened to include only conditions that included all of the following attributes: those that had no evidence of disturbance, were classified as accessible forest land, were inventoried since 2000, and for which our primary variables of interest were defined (age, biomass, and forest type). 
We fit a three-parameter logistic growth function with Gamma-distributed noise relating biomass to age. The model was defined as

`biomass ~ Gamma(shape, scale)`

`shape = mu / scale`

`mu = amplitude * (1 / (1 + c * exp(-b * age)) - (1 / (1 + c))) * ((c + 1) / c)`

`amplitude = a + w_tavg * tavg + w_ppt * ppt`

Because the mean of the Gamma distribution is the product of the shape and the scale, the mean of this parameterization’s  distribution is given directly by the logistic function, and the scale defines the noise. The parameter b controls the slope, and the amplitude is controlled by a constant plus a weighted function of climatic variables. 

(Note: the somewhat unusual parameterization of the growth curve was designed so that the parameter c allows the shape to interpolate between a simple logistic (for c of 1) and a sigmoid (for c greater than 1). For all values of c, the function evaluates to 0 when age is 0; for large age values, the function evaluates to the amplitude, thus forcing the function through the origin). 

The Gamma distribution was used as the noise model rather than a Gaussian based on some basic statistical properties of the data: biomass is strictly positive, and its variance tends to grow with its mean. We confirmed that fitted model parameters were generally similar when using a Gaussian noise model, but samples from the fitted model were far closer to the measured data distribution when using the Gamma.

The model was fit independently to each of the 112 forest types in our dataset, with a median number of 1057 conditions per forest type (min of 60, max of 27874). To ensure that each forest type had 50 or more condition measurements, we aggregated some sparse forest types into more common ones (59 were so aggregated out of the initial set of 171). Each model was fit using all conditions from a given forest type regardless of their specific inventory year. We did not explicitly model the inventory year or whether a condition was inventoried repeatedly, i.e. conditions with repeated inventories were treated as independent samples. Our drought models (described in the ‘Drought’ subsection) leverage repeated inventories explicitly.

All parameters were fit jointly using maximum likelihood as defined by the Gamma distribution. Constrained nonlinear optimization was performed in Python with the `scipy` `minimize` function using the `trust-constrained` algorithm. Parameters a and b were bounded below at 0.00001 and parameter c was bounded below at 1. Otherwise parameters were unbounded. Although the model was fit using maximum likelihood, for interpretability model performance was also assessed using R<sup>2</sup> between predicted and actual biomass, with a median of 0.29 across the 112 forest types, a minimum of 0.050, and a maximum of 0.63. In general, the effects of climatic variables in the model were weak, variable across forest types, and increased model performance only slightly. Average fitted parameters showed a positive relationship with precipitation (increased maximum amplitude of biomass with higher precipitation) and negative relationship with temperature (decreased maximum amplitude of biomass with higher temperatures), but these relationships were variable across forest types. While principled model selection might suggest dropping these variables from the model, we include them for comparability with our other models, all of which include climatic variables.

To predict future biomass, we “grew” forests starting in the year 2020 and proceeding in 20-year increments, based on fitted growth curves and climate data from CMIP6 projections (see below). We set the initial stand age based on the measured stand age plus the elapsed time between that measurement and 2020. For example, a condition that was inventoried in 1990 with a stand age of 35 would be assigned a starting age of 65 in 2020 (t0), reflecting its growth since the latest measured stand age. Then, at each future timestep t, we computed a growth delta by predicting biomass with the climate in year t and the age in year t minus the biomass with the climate in year t and the age in year t-1. This delta was then added to the total biomass from year t-1 to obtain a biomass in year t.

See the [biomass model notebook]() for example raw data, fitted growth curves, and examples showing the appropriateness of the Gamma distribution as the noise model. See the [biomass results notebook]() for summary statistics and maps of historical and future biomass.

### Fire

We developed a statistical model relating the probability of very large fires to climatic variables. Our work is inspired by and builds on that of Barbero et al. (2014). Many of the methods are similar, though updated with more recent data (through 2018 rather than 2010). 

The model was fit to historical fire data from the Monitoring Trends in Burn Severity (MTBS) database (described in more detail below). Similar to Barbero et al., we defined “very large fires” (VLFs) as fires exceeding 5073 ha. Within each spatial grid cell of a 4km grid and for each month from 1984 and 2018, we coded a 1 if a VLF was present in that location in that month, and a 0 otherwise. This yielded a binary dataset of (t) x (x) x (y) where t is 420 (12 months x 35 years) and x and y are spatial dimensions. For performance during fitting, we upscaled the grid by a factor of 8, computing the mean value within each 32km grid cell. After upscaling we once again thresholded, setting any grid cell greater than 0 to 1.

As regressors, we considered temporally-varying climatic variables as well as time-invariant variables to account for heterogeneity in vegetation. Our primary climatic variables were tavg, ppt, pdsi, and cwd, derived from the Terraclim dataset for the historical period matched to the MTBS record (see below). For vegetation, we used the National Forest Type Dataset. This dataset describes, at 250m resolution, the most common forest group type (out of 28). We downsampled this dataset to compute the fraction of each forest group type belonging to each 4km grid cell, and then used this continuous valued feature as an additional regressor. To limit the number of variables, sparse forest group types were grouped into supersets by combining all forest group types having spatial area under a threshold with their nearest neighbor. This grouping removed 11 groups, and had little qualitative effect on model performance or the spatial structure of predictions.

We fit a logistic regression model to predict the presence of a VLF in each month and spatial location across the dataset. Formally, the model defines a very large fire in a given time and location as Bernoulli random variable where the Bernoulli probability is defined by a logistic function of a weighted, linear combination of temporally-varying and time-invariant variables. In addition to the variables described above, we included an extra regressor to better capture long-term annual climate trends. Specifically, for each climate variable, we computed a spatially and temporally-averaged value per year, and then included that as a regressor for all locations and months corresponding to that year. In practice, including this extra regressor improved model performance slightly, but allowed the model to better reproduce the observed increase in total very large fire area over the observation period (Abatzaglou and Williams, 2016).

We fit the model in Python using the LogisticRegression method from `scikit-learn` (Pedregosa et al., 2011) with the lbfgs algorithm. We assessed model accuracy using an area-under-the-ROC-curve metric with 25/75 cross-validation. We also assessed model performance through its ability to reproduce three trends: annual trends, seasonal trends, and spatial trends. Each of these corresponds to a “slice” or “grouping” of the three-dimensional data array — specifically, averaging across months and space (for the annual trend), averaging across years and space (for the seasonal trend), and averaging across time (for the spatial trend). In each case, we computed a correlation coefficient between the value computed directly from the data and from the model’s predicted probabilities. While these are not the metrics on which the model is trained, they nevertheless provide an indication of how well the model captures clearly observable patterns in the data.

See the [fire model notebook]() for example raw data, summary statistics, and fits from the model described above.

### Drought

We aggregated FIA data on live and dead basal area from a tree-level to a ‘condition’ level, grouping together conditions representing repeated inventories of the same location. We screened for plots that had at least 2 or more inventory measurements, which enables the estimation of a true mortality rate. We next screened out plots that had a “fire” or “human” or “insect” disturbance code to remove major non-drought disturbances. 

We estimated the fraction of mortality based on the concept of a census interval, which we define as a pair of measurements in two successive years:

`(year(t), year(t-1))`

The fraction of mortality is defined as the ratio of dead basal area in year(t) to the total basal area in year(t-1). We computed this ratio separately for each condition. Given that several plots only had one repeated measure (only one census interval), we used the first census interval for all conditions. We also included in the mortality models two stand variables of age and age-squared to account for background ecological dynamics such as self-thinning and  background mortality), following Hember et al. (2017).

Given the large prevalence of zeros in our mortality data, we modeled mortality using a “hurdle” model that jointly predicts the probability of a non-zero value and, if a non-zero value is present, its value. We formally represented the hurdle model using a sequence of two generalized linear models: a Binomial model with logit link function predicting zero vs non-zero values, and a linear Gaussian model with log-normal link function predicting mortality in the conditions where it was non-zero. The log-normal link function for the linear regression was chosen based on inspecting the behavior of the raw data distributions. We implemented the hurdle model in Python using `scikit-learn` by combining a `LogisticRegression` and a `TweedieRegressor` with `power=0` and a log link. To ensure robustness, results were compared to an alternate implementation using the GLM from statsmodels, and the glm package in R, with only negligible differences in results or performance.

The model was fit independently to each of the 112 forest types in our dataset. To ensure that each forest type had 50 or more condition measurements, we aggregated some sparse forest types into more common ones (59 were so aggregated out of the initial set of 171).

See the [drought model notebook]() for example raw data and fits of the model described above to example forest types. See the [drought results notebook]() for summary statistics and maps of historical and future drought.

### Insects

### Albedo

## Data sources

### FIA

Some pithy intro to FIA: 
[ just take from `intake` https://github.com/carbonplan/data/blob/master/carbonplan_data/catalogs/fia.yaml]

What we did.
Introduce database structure: Trees >> Condition >> Plot.

We calculated a series of `condition` level summary statistics from the underlying `TREE` data. 

Introduce concept of “Adjustment” 

Adjusted living basal area, as well as above and belowground biomass. 
Adjusted mortality basal area (between surveys)
Disturbances and treatment. 

Generate year, condition dataset per state that served as a common basis for biomass and insect/drought modeling.

QA/QC 
Our BALive matches COND BALive. 
Evaluated results against collaborator data procured directly from an FIA database expert that has been the basis of numerous peer reviewed articles.  

>>> my bad pithy intro
The Forest Inventory and Analysis (FIA) program, administered by the US Department of Agriculture Forest Service, maintains an extensive forest plot survey network that spans all forested lands in the United States. 

Intensity: 6000 acres. 
Field crews collect site level attributes, tree level attribute such as overall health, diameter, age, height. 
Each plot is revisited on a maximum ten-year rotation. 

Provenance: We downloaded FIA data from [point to intake]

### MTBS

### NLCD

### Terraclim

### CMIP6

### Downscaling

export default ({ children }) => <Box>{children}</Box>


