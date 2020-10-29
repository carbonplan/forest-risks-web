import { Box } from 'theme-ui'

## Summary

These maps show the potential carbon removal associated with forest growth alongside risks to forest carbon loss across the continental US (current) and Alaska (still in development). All quantities are estimated based on historical data and then projected into the future using climate models. Model predictions are harmonized to a common resolution of 4km, which is the maximum current resolution available for the underlying downscaled climate models. We will explore ways to increase resolution further in the future.

## Methods

Here we briefly describe how we built the biomass map and the risk maps for fire, drought, insects, and albedo. Most of these in turn depend on several raw datasets, as well as downscaled climate models, all of which are described below. All the input data is available in public cloud storage (see below), and Python code for reproducing these analyses from those data is available on [Github](https://github.com/carbonplan/forests). Several Jupyter notebooks are available documenting different aspects of the analysis, and are referenced below. We expect to continue to iterate and improve these models over time, and will update our code and the description of these methods accordingly.

### Biomass

We developed a statistical model relating forest stand age to biomass, in order to project future biomass under assumptions of continued growth. Our approach was inspired by and similar to that of Zhu et al. (2018), albeit with differences in the specific model and variables used.

The model was fit to historical data from the Forest Inventory Analysis. We aggregated data from individual trees to “conditions”, each of which represent a portion of a plot with similar land use and vegetation. We screened to include only conditions that: had no evidence of disturbance, were classified as accessible forest land, were inventoried since 2000, and for which our primary variables of interest were defined (age, biomass, and forest type). For a given fit, all conditions were included regardless of their specific inventory year, and we did not explicitly model the inventory year or whether a condition was repeated, i.e. conditions with repeated inventories were treated as independent samples. Our drought models (described below) leverage repeated inventories explicitly.

We fit a three parameter logistic growth function with Gamma-distributed noise relating biomass to age. The model was defined as

`biomass ~ Gamma(shape, scale)`

`shape = mu / scale`

`mu = amplitude * (1 / (1 + c * exp(-b * age)) - (1 / (1 + c))) * ((c + 1) / c)`

`amplitude = a + w_tavg * tavg + w_ppt * ppt`

The mean of the Gamma distribution is the product of the shape and the scale, so with this parameterization, the mean of the distribution is given directly by the logistic function, and the scale defines the noise. The parameter b controls the slope, and the amplitude is controlled by a constant plus a weighted function of climatic variables.

(Note: the somewhat unusual parameterization of the growth curve was designed so that the parameter c allows the shape to interpolate between a simple logistic (for c of 1) and a sigmoid (for c greater than 1). But for all values of c, when age is 0 the function evaluates to 0 and for large age it evaluates to the amplitude, thus forcing the function through the origin).

The Gamma distribution was used as the noise model rather than a Gaussian based on some basic statistical properties of the data: biomass is strictly positive, and its variance tends to grow with its mean. Fitted model parameters were generally similar when using a Gaussian noise model instead, but samples from the fitted model were far closer to the measured data distribution when using the Gamma.

See the [biomass model notebook]() for example raw data, fitted growth curves,

The model was fit independently to each of the 112 forest types in our dataset, with a median number of 1057 conditions per forest type (min of 60, max of 27874). All parameters were fit jointly using maximum likelihood as defined by the Gamma distribution. Constrained nonlinear optimization was performed with the `scipy` `minimize` function using the trust constrained algorithm. Parameters a and b were bounded below at 0.00001 and parameter c was bounded below at 1, otherwise parameters were unbounded. Although the model was fit using maximum likelihood, for interpretability model performance was also assessed using R2 between predicted and actual biomass, which had a median of 0.29 across the 112 forest types with a minimum of 0.050 and maximum of 0.63. In general, the effects of climatic variables in the model were weak, variable across forest types, and increased model performance only slightly. Average fitted parameters showed a positive relationship with precipitation (increased maximum amplitude of biomass with higher precipitation) and negative relationship with temperature (decreased maximum amplitude of biomass with higher temperatures), but these relationships were variable across forest types. While principled model selection may suggest dropping these variables from the model, we include them for comparability with our other models, all of which include climatic variables.

See the [biomass results notebook]() for summary statistics and maps of actual and predicted biomass.

To predict future biomass, we “grew” forests using the fitted growth curves starting from 2020 in 20 year increments, with climate data from CMIP6 projections (see below). First, for 2020, we set the stand age for each condition as the measured stand age plus 2020 minus the year the condition was inventories. For example, a condition inventoried in 1990 with a stand age of 35 would be assigned a starting age of 65 in 2020 (t0). Then, at each future timestep t, we computed a growth delta by predicting biomass with the climate in year t and the age in year t minus the biomass with the climate in year t and the age in year t-1. This delta was then added to the total biomass from year t-1 to obtain a biomass in year t.

### Fire

### Drought

We aggregated FIA data from a tree-level to live and dead basal area at the ‘condition’ level. We first screened for only plots that had 2 or more inventory measurements, which enables the estimation of a true mortality rate. We next screened out plots that had a “fire” or “human” disturbance code to remove major non-drought disturbances. We modeled the fraction of mortality over a census interval for each condition within a forest-type model. We aggregated conditions into common forest-types to ensure that all forest-types had 50 or more condition measurements.

We then modeled the basal area fraction of mortality as a function of five climate variables over the census interval (minimum annual PDSI and precipitation, maximum annual VPD, CWD, and average temperature), chosen a priori to reflect known drought-mortality drivers (e.g. Williams et al. 2013; Anderegg et al. 2013, 2015; Venturas et al., in press). We further included two stand variables of age and age-squared to account for background ecological dynamics (e.g. self-thinning, background mortality), following Hember et al. (2017), in the mortality models. We modeled mortality using hurdle models that jointly estimate the binomial probability of a zero or non-zero mortality rate and - for the non-zero mortality rates - a generalized linear model using a log-normal error distribution.

### Insects

### Albedo

## Data sources

### FIA

### MTBS

### NLCD

### Terraclim

### CMIP6

### Downscaling

export default ({ children }) => <Box>{children}</Box>
