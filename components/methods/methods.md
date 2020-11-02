import { Box } from 'theme-ui'

## Summary

These maps —built In collaboration between CarbonPlan and a team of researchers — show the potential carbon removal associated with forest growth and risks to forest carbon loss across the continental US (current) and Alaska (still in development). All quantities are estimated based on historical data and then projected into the future using data generated from climate models. Model predictions are harmonized to a common resolution of 4km to match available gridded climate observations.

## Usage

In the sidebar on the left you can click to turn different layers on and off, and select different climate scenarios. For each selection, the results reflect an ensemble average of several climate models for that scenario. By clicking the magnifying glass, you can bring up a circular focus window. Dragging that around allows you to see regional statistics with further explanation of the layers.

## Methods

Here, we briefly describe how we built the biomass map and the risk maps for fire, drought mortality, insect mortality, and net biophysical climate feedbacks. These maps are based on several datasets, including ground observations and downscaled climate model scenarios, that are described below. All the input data is available in public cloud storage, and Python code for reproducing these analyses from those data is available on [Github](https://github.com/carbonplan/forests). Several Jupyter notebooks are available documenting different aspects of the analysis and are referenced below. We expect to continue to iterate and improve these models over time and will update our code and the description of these methods accordingly.

### Biomass

We developed a statistical model relating forest stand age to biomass, in order to project future biomass under assumptions of historical growth trends. Our approach was inspired by and is similar to that of Zhu et al. (2018), with some differences in model and variable specifications.

The model was fit to historical data from the US Forest Service Forest Inventory Analysis long-term permanent plot network (Gillespie 1999). We aggregated data from individual trees to "conditions", each of which represents a portion of a plot with similar land cover class types, size classes, and other distinguishing characteristics. We screened to include only conditions that included all of the following attributes: those that had no evidence of disturbance, were classified as accessible forest land, were inventoried since 2000, and for which our primary variables of interest were defined (age, biomass, and forest type).
We fit a three-parameter logistic growth function with Gamma-distributed noise relating biomass to age. The model was defined as

`biomass ~ Gamma(shape, scale)`

`shape = mu / scale`

`mu = amplitude * (1 / (1 + c * exp(-b * age)) - (1 / (1 + c))) * ((c + 1) / c)`

`amplitude = a + w_tavg * tavg + w_ppt * ppt`

Because the mean of the Gamma distribution is the product of the shape and the scale, the mean of this parameterization’s distribution is given directly by the logistic function, and the scale defines the noise. The parameter `b` controls the slope, and the amplitude is controlled by a constant plus a weighted function of climate variables.

(Note: the somewhat unusual parameterization of the growth curve was designed so that the parameter `c` allows the shape to interpolate between a simple logistic (for `c` of 1) and a sigmoid (for `c` greater than 1). For all values of `c`, the function evaluates to 0 when age is 0; for large age values, the function evaluates to the amplitude. Thus, the parameterization forces the function through the origin).

A Gamma distribution was used as the noise model rather than a Gaussian based on some basic statistical properties of the data: biomass is continuous, strictly positive, and its variance tends to grow with its mean. We confirmed that fitted model parameters were generally similar when using a Gaussian noise model, but samples from the fitted model were far closer to the measured data distribution when using the Gamma.

The model was fit independently to each of 112 forest types, with a median number of 1057 conditions per forest type (min of 60, max of 27874). To ensure that each forest type had 50 or more condition measurements, we aggregated some sparse forest types into more common ones (59 were so aggregated out of the initial set of 171). Each model was fit using all conditions from a given forest type regardless of their specific inventory year. We did not explicitly model the inventory year or whether a condition was inventoried repeatedly, i.e. conditions with repeated inventories were treated as independent samples. Our drought and insect models (described in the 'Drought' and 'Insects' subsection) leverage repeated inventories explicitly.

All parameters were fit jointly using maximum likelihood as defined by the Gamma distribution. Constrained nonlinear optimization was performed in Python with the [`scipy.optimize.minimize` function](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html) using the `trust-constrained` algorithm. Parameters `a` and `b` were bounded below at 1e-5 and parameter `c` was bounded below at 1. Otherwise parameters were unbounded. Although the model was fit using maximum likelihood, for interpretability model performance was also assessed using `R²` between predicted and actual biomass, with a median of 0.29 across the 112 forest types, a minimum of 0.050, and a maximum of 0.63. In general, the effects of climatic variables in the model were weak, variable across forest types, and increased model performance only slightly. Average fitted parameters showed a positive relationship with precipitation (increased maximum amplitude of biomass with higher precipitation) and negative relationship with temperature (decreased maximum amplitude of biomass with higher temperatures), but these relationships were variable across forest types. While principled model selection might suggest dropping these variables from the model, we include them for comparability with our other models, all of which include climatic variables.

To predict future biomass, we "grew" forests starting in the year 2020 and proceeding in 20-year increments, based on fitted growth curves and climate data from CMIP6 projections (see below). We set the initial stand age based on the measured stand age plus the elapsed time between that measurement and 2020. For example, a condition that was inventoried in 1990 with a stand age of 35 would be assigned a starting age of 65 in 2020 (`t₀`), reflecting its growth since the latest measured stand age. Then, at each future timestep `t₁`, we computed a growth delta by predicting biomass with the climate in year `t₁` and the age in year `t₁` minus the biomass with the climate in year `t₁` and the age in year `t₀`. This delta was then added to the total biomass from year `t₀` to obtain a biomass in year `t₁`.

See the [biomass model notebook](https://github.com/carbonplan/forests/blob/master/notebooks/biomass/biomass_model.ipynb) for example raw data, fitted growth curves, and examples showing the appropriateness of the Gamma distribution as the noise model.

### Fire

We developed a statistical model relating the probability of very large fires to climatic variables. Our work is inspired by and builds on that of Barbero et al. (2014). Many of the methods are similar, though updated with more recent data (through 2018 rather than 2010).

The model was fit to historical fire data from the Monitoring Trends in Burn Severity (MTBS) database (described in more detail below). Similar to Barbero et al., we defined "very large fires" (VLFs) as fires exceeding 5073 ha. Within each spatial grid cell of a 4km grid and for each month from 1984 and 2018, we coded a 1 if a VLF was present in that location in that month, and a 0 otherwise. This yielded a binary dataset of `t × x × y` where t is 420 (12 months `×` 35 years) and `x` and `y` are spatial dimensions. For performance during fitting, we upscaled the grid by a factor of 4. After upscaling we once again thresholded, setting any grid cell greater than 0 to 1. The resulting fitted probabilities were divided by 4 to correct for the bias introduced by this step.

As regressors, we considered temporally-varying climatic variables as well as time-invariant variables to account for heterogeneity in vegetation. Our primary climatic variables were `tavg` and `ppt`, derived from the TerraClimate dataset (described below) for the historical period matched to the MTBS record (see below). We also considered models with `pdsi` and `cwd`. For vegetation, we used the National Forest Type Dataset. This dataset describes, at 250m resolution, the most common forest group type (out of 28). We downsampled this dataset to compute the fraction of each forest group type belonging to each 4km grid cell, and then used this continuous valued feature as an additional regressor. To limit the number of variables, sparse forest group types were grouped into supersets by combining all forest group types having spatial area under a threshold with their nearest neighbor. This grouping removed 11 groups, and had little qualitative effect on model performance or the spatial structure of predictions.

We fit a logistic regression model to predict the presence of a VLF in each month and spatial location across the dataset as a function of climate variables. Formally, the model defines a very large fire in a given time and location as Bernoulli random variable where the Bernoulli probability is defined by a logistic function of a weighted, linear combination of temporally-varying and time-invariant variables. In addition to the variables described above, we included an extra regressor to better capture long-term annual climate trends. Specifically, for each climate variable, we computed a spatially and temporally-averaged value per year, and then included that as a regressor for all locations and months corresponding to that year. In practice, including this extra regressor improved model performance slightly, but allowed the model to better reproduce the observed increase in total very large fire area over the observation period (Abatzaglou and Williams, 2016).

We fit the model in Python using the [LogisticRegression](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html) method from `scikit-learn` (Pedregosa et al., 2011) with the `lbfgs` algorithm. We assessed model accuracy using an area-under-the-ROC-curve metric with 25/75 cross-validation. We also assessed model performance through its ability to reproduce three trends: annual trends, seasonal trends, and spatial trends. Each of these corresponds to a "slice" or "grouping" of the three-dimensional data array — specifically, averaging across months and space (for the annual trend), averaging across years and space (for the seasonal trend), and averaging across time (for the spatial trend). In each case, we computed a correlation coefficient between the value computed directly from the data and from the model’s predicted probabilities. While these are not the metrics on which the model is trained, they nevertheless provide an indication of how well the model captures clearly observable patterns in the data.

For visualization purposes, predicted monthly probabilities of fire from the model (averaged over years) were converted to annual probabilities by computing the probability of at least one fire in a given year based on the monthly probabilities and assuming independence.

See the [fire model notebook](https://github.com/carbonplan/forests/blob/master/notebooks/fire/fire_model.ipynb) for example raw data, summary statistics, and fits from the model described above.

### Drought

We aggregated FIA data on live and dead basal area from a tree-level to a ‘condition’ level, grouping together conditions representing repeated inventories of the same location. We screened for plots that had at least 2 or more inventory measurements, which enables the estimation of a true mortality rate. We next screened out plots that had a "fire" or "human" disturbance code or a "cutting" treatment code to remove major non-drought disturbances.

We estimated the fraction of mortality based on the concept of a census interval, which we define as a pair of measurements in two successive years:

`(t₀, t₁)`

The fraction of mortality is defined as the ratio of dead basal area in `t₁` to the total basal area in `t₀`. We computed this ratio separately for each condition. Given that several plots only had one repeated measure (only one census interval), we used the first census interval for all conditions. We also included in the mortality models two stand variables of age and age-squared to account for background ecological dynamics such as self-thinning and background mortality), following Hember et al. (2017).

We fit a statistical model predicting mortality as a function of climatic variables. Given the large prevalence of zeros in our mortality data, we modeled mortality using a "hurdle" model that jointly predicts the probability of a non-zero value and, if a non-zero value is present, its value (Cragg, 1971). We formally represented the hurdle model using a sequence of two generalized linear models: a Binomial model with logit link function predicting zero vs non-zero values, and a linear Gaussian model with log-normal link function predicting mortality in the conditions where it was non-zero. The log-normal link function for the linear regression was chosen based on inspecting the behavior of the raw data distributions. We implemented the hurdle model in Python using `scikit-learn` by combining a [`LogisticRegression`](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html) and a [`TweedieRegressor`](https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.TweedieRegressor.html) with `power=0` and a log link. To ensure robustness, results were compared to an alternate implementation using the GLM from the library `statsmodels`, and the glm package in `R`, with only negligible differences in results or performance.

The model was fit independently to each of the 112 forest types in our dataset. To ensure that each forest type had 50 or more condition measurements, we aggregated some sparse forest types into more common ones (59 were so aggregated out of the initial set of 171).

See the [drought model notebook](https://github.com/carbonplan/forests/blob/master/notebooks/drought/drought_model.ipynb) for example raw data and fits of the model described above to example forest types.

### Insects

Our analysis of insect-driven mortality was nearly identical to our analysis of drought. The first difference was that the dependent variable was fractional mortality multiplied by a condition-level estimate of the fraction of trees affected by insects, which is an assessment performed at the level of individual trees. This effectively captures the component of mortality specifically realted to insects. The second difference is that, while fitting the hurdle model, we only included forest types with at least one positive exemplar. All other aspects of the input data and the model were the same.

### Biophysical

Biophysical effects from forests include an albedo effect (in which energy is reflected or absorbed) and a latent heat effect (in which the cooling effect of trees is modulated through evapotranspiration). In other words, trees can simultaneously warm the planet by absorbing radiation but also cool the planet via evaporating water — in addition to their role in the global carbon cycle. This net effect, which we label "biophysical", depends on the forest type and the climate conditions. In most forests, this effect is net negative, with trees absorbing more energy than they emit. To estimate this variable we applied a biome-specific biophysical effect from Anderson-Teixeira et al (2012) to each of the mapped forest types from the National Land Cover Dataset (NLCD). The resulting layer is a continuous map of biophysical effects due to forests. We then assume this variable to be constant throughout time. See the [biophysical notebook](https://github.com/carbonplan/forests/blob/master/notebooks/biophysical/biophysical_model.ipynb) for detailed description of the mapping between biomes and forest types and the resulting biophysical maps.

## Data sources

### FIA

The Forest Inventory and Analysis dataset is a nationwide survey made up of an extensive series of long-term forest monitoring plots that the United States Forest service uses to monitor the growth, mortality, and overall health of US forests.

Our analysis relied on two components of the FIA database: tree level measurements and condition-level measurements. From the raw, per-tree measurements, we calculated a series of condition-level summary statistics, like total living basal area and above ground biomass, and combined these with other condition-level summaries from the database. Some analyses (biomass) used all conditions directly, whereas for other analyses (drought, insects) we grouped conditions across repeated measurements (across surveys). These preprocessed data served as a common basis for all biomass and risk modeling. For all analyses, we only included conditions with a "condition proportion" greater than 0.3, which means that the condition represented at least 30% of its corresponding plot.

Provenance: We downloaded FIA data from the [FIA Data Mart in CSV format](https://apps.fs.usda.gov/fia/datamart/CSV/datamart_csv.html).

### MTBS

The Monitoring Trends in Burn Severity (MTBS) dataset includes 30m annual rasters of burn severity as well as burned area boundary polygons for individual fires (Eidenshink et al, 2007). The dataset covers fires from 1984-2018 and includes fires larger than 500 acres (1000 acres in the Western U.S.) for the continental U.S., Alaska, Hawaii, and Puerto Rico.

For our analysis, we primarily used the fire boundaries dataset, creating monthly rasters of burned-area on our 4 km project grids by rasterizing the polygons of individual large (404-5073 ha) and very large fires (>5073 ha) following Barbero et al. (2014). See the [MTBS rasterization notebook](https://github.com/carbonplan/data/tree/master/scripts/mtbs) for a detailed description of the rasterization process.

### NLCD

The National Land Cover Database (NLCD; Dewitz (2019)) includes 30 m land cover classification rasters at 2-3-year intervals (from 2001-2016). Separate raster datasets are available for the contiguous U.S. and Alaska.

Our processing of the NLCD dataset included downsampling the categorical data from 30m to 4km resolution. For each of the 20 land cover categories of interest (11, 12, 21, 22, 23, 24, 31, 41, 42, 43, 51, 52, 71, 72, 73, 74, 81, 82, 90, 95), we extract a binary coverage mask, then upscale the high resolution raster using the arithmetic mean. The downsampling process results in fractional coverage 4km rasters for each of the 20 land cover categories. See the [NLCD downsampling and reprojection notebook](https://github.com/carbonplan/data/blob/master/scripts/nlcd/02_downsampling_and_reprojection.ipynb) for specific details of the process.

### TerraClimate

The TerraClimate dataset provides monthly climate and climatic water balance terms (Abatzoglou et al, 2018). The dataset extent includes all land areas on a global 1/24th degree grid from 1958-2019.

To process the TerraClimate dataset, we regridded the data from its global 1/24th degree grid to our 4km project grid using [Xesmf’s](https://xesmf.readthedocs.io/en/latest/index.html) bilinear interpolation.

### CMIP6

Future projections of biomass, fire risk, drought mortality, and insect mortality were made using climate model data from the Coupled Model Intercomparison Project Phase 6 (CMIP6; Eyring et al, 2016). We used the Pangeo Project’s archive of the CMIP6 dataset available on [Google Cloud Platform](https://console.cloud.google.com/marketplace/product/noaa-public/cmip6?_ga=2.46871527.-1119720002.1551810800). For our analysis, we extracted monthly mean fields for the variables precipitation (pr), minimum daily temperature (tasmin), and maximum daily temperature (tasmax). Of the available data, we selected 12 climate models (BCC-CSM2-MR, ACCESS-CM2, FGOALS-g3, AWI-CM-1-1-MR, NESM3, MIROC6, CMCC-CM2-SR5, MPI-ESM-1-2-HAM, CanESM5, MPI-ESM1-2-LR, ACCESS-ESM1-5, MRI-ESM2-0) and 3 SSPs (2-4.5, 3-7.0, 5-8.5) based on data availability as of September 2020.

Our processing of the individual CMIP6 datasets included regridding the data from its native global grid to our 4km project grid. This process was done using [Xesmf’s](https://xesmf.readthedocs.io/en/latest/index.html) bilinear interpolation.

### Downscaling

Data from climate models, like those included in CMIP6, frequently have significant biases that need to be corrected prior to use in impacts modeling studies like ours. These biases are due to both the models’ coarse spatial resolution and model errors. The downscaling and bias correction process is meant to correct the systemic biases in climate models, while preserving the underlying climate signals (e.g. warming or drying trends). Our team has been developing a collection of statistical downscaling methods in the open source Python package [Scikit-Downscale](https://scikit-downscale.readthedocs.io/).

Our work here has included the evaluation of multiple downscaling methods for the applications of modeling biomass, fire, insects, and drought and the production of multiple open-access datasets. See the [carbonplan/cmip6-downscaling](https://github.com/carbonplan/cmip6-downscaling) project for more information on existing and work-in-progress methods and datasets.

At the time of writing, the maps shown here include CMIP6 data that has had a seasonal-cycle bias correction applied to it. Every future month was corrected according to that month’s average bias within the historic period of 1960-2009. In the coming weeks, we will add the output from more robust downscaling methods.

## Acknowledgements

These data products and the website were developed jointly by the following contributors (in alphabetical order): Bill Anderegg (University of Utah), Grayson Badgley (Black Rock Forest / Columbia University), Oriana Chegwidden (CarbonPlan), Jeremy Freeman (CarbonPlan), Joe Hamman (CarbonPlan), Jake Mensch, Anna Trugman (UC Santa Barbara).

The development of this project was funded, in part, through a grant from the Microsoft AI for Earth program to CarbonPlan.

## References

Abatzoglou et al. (2018) Terraclimate, a high-resolution global dataset of monthly climate and climatic water balance from 1958-2015, Scientific Data, [DOI](https://doi.org/10.1038/sdata.2017.191)

Abatzoglou and Williams (2016) Impact of anthropogenic climate change on wildfire across western US forests, PNAS, [DOI](https://doi.org/10.1073/pnas.1607171113)

Anderson-Teixeira, K. et al. (2012) Climate-regulation services of natural and agricultural ecoregions of the Americas, Nature Clim Change, [DOI](https://doi.org/10.1038/nclimate1346)

Barbero et al. (2015) Multi‐scalar influence of weather and climate on very large‐fires in the Eastern United States, Env. Research Letters, [DOI](http://dx.doi.org/10.1088/1748-9326/9/12/124009)

Cragg (1971) Some Statistical Models for Limited Dependent Variables with Application to the Demand for Durable Goods, Econometrica, [DOI](http://dx.doi.org/10.2307/1909582)

Eidenshink et al. (2007) A project for monitoring trends in burn severity, Fire Ecology, [DOI](https://doi.org/10.4996/fireecology.0301003)

Eyring et al. (2016) Overview of the Coupled Model Intercomparison Project Phase 6 (CMIP6) experimental design and organization, Geosci. Model Dev., [DOI](https://doi.org/10.5194/gmd-9-1937-2016)

Gillespie (1999) Rationale for a national annual forest inventory program, Journal of Forestry, [URL](https://academic.oup.com/jof/article/97/12/16/4613993)

Hember et al. (2017) Relationships between individual‐tree mortality and water‐balance variables indicate positive trends in water stress‐induced tree mortality across North America, Global Change Biology, [DOI](https://doi.org/10.1111/gcb.13428)

Pedregosa et al. (2011) Scikit-learn: Machine Learning in Python, JMLR, [DOI](http://jmlr.csail.mit.edu/papers/v12/pedregosa11a.html)

Zhu et al. (2018) Global biomass density of potential wild large grazers for present-day and the last glacial maximum, simulated by a DGVM model, PANGAEA [DOI](https://doi.org/10.1594/PANGAEA.884853)

export default ({ children }) => <Box>{children}</Box>
