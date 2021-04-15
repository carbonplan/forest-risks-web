import { Box } from 'theme-ui'
import { alpha } from '@theme-ui/color'

## Summary

These maps — built in collaboration between CarbonPlan and a team of researchers — show risks to forest carbon alongside the potential carbon removal associated with forest growth  across the contiguous US. Models are fit to historical data and then projected into the future using climate model data. Model predictions are shown for three scenarios of future warming for the 21st century. *Note: drought and insect models are still in development so we currently only show historical risks for these disturbance types.

## Usage

In the sidebar on the left you can click to turn different layers on and off, and select different climate scenarios. For each selection, the results reflect an ensemble average of six climate models for that scenario. Clicking the magnifying glass (lower left) displays a circular focus window, which can be dragged around to see spatially-averaged risks for forests within that circle for the given timestep. 

## Data access

Raster data underlying all primary map layers in the web UI are available in the [`zarr`](https://github.com/zarr-developers/zarr-python) format at the following locations.

<Box sx={{bg: alpha('muted', 0.5), borderRadius: '2px', p: [3]}}>
<Box as='span' sx={{overflowWrap: 'break-word', fontFamily: 'mono', fontSize: [2]}}>FIRE: <br/>https://carbonplan.blob.core.windows.net/carbonplan-forests/risks/results/web/fire.zarr</Box>
<br/>
<br/>
<Box as='span' sx={{overflowWrap: 'break-word', fontFamily: 'mono', fontSize: [2]}}>BIOMASS: <br/>https://carbonplan.blob.core.windows.net/carbonplan-forests/risks/results/web/biomass.zarr</Box>
<br/>
<br/>
<Box as='span' sx={{overflowWrap: 'break-word', fontFamily: 'mono', fontSize: [2]}}>DROUGHT: <br/>https://carbonplan.blob.core.windows.net/carbonplan-forests/risks/results/web/drought.zarr</Box>
<br/>
<br/>
<Box as='span' sx={{overflowWrap: 'break-word', fontFamily: 'mono', fontSize: [2]}}>INSECTS: <br/>https://carbonplan.blob.core.windows.net/carbonplan-forests/risks/results/web/insects.zarr</Box>
</Box>

## Methods

The biomass map and the risk maps for fire, drought mortality, and insect mortality are based on several datasets, including field observations, remote sensing estimates, and downscaled climate projections — all of which are described below. Our maps are aligned to a common 4km Albers equal-area grid. All input data are available in public cloud storage and Python code for reproducing our analyses is available on [Github](https://github.com/carbonplan/forest-risks). We expect to continue to iterate and improve these models over time and will update our code and the description of these methods accordingly.

### Biomass

We developed a statistical model relating forest stand age to biomass in order to project future biomass under assumptions of historical growth trends. Our approach was inspired by and is similar to that of Zhu et al. (2018), with some differences in model and variable specifications.

The model was fit to historical data from the US Forest Service Forest Inventory Analysis (FIA) long-term permanent plot network (Gillespie 1999). We aggregated data from individual trees to "conditions," each of which represents a portion of a plot with similar land cover class types, size classes, and other distinguishing characteristics. We screened the FIA data to only use conditions with all of the following attributes: those that had no evidence of disturbance, were classified as accessible forest land, were inventoried since 2000, and for which our primary variables of interest were defined (age, biomass, and forest type).

We fit a three-parameter logistic growth function with Gamma-distributed noise relating biomass to age. The model was defined as:

<Box sx={{fontFamily: 'mono', bg: alpha('muted', 0.5), borderRadius: '2px', p: [3], fontSize: [2, 2, 2, 3]}}>
biomass ~ Gamma(shape, scale)
<br/>
<br/>
shape = mu / scale
<br/>
<br/>
mu = amplitude * (1 / (1 + c * exp(-b * age)) - (1 / (1 + c))) * ((c + 1) / c)
<br/>
<br/>
amplitude = a + w_tavg * tavg + w_ppt * ppt
</Box>

Because the mean of the Gamma distribution is the product of the shape and the scale, the mean of this parameterization’s distribution is given directly by the logistic function and the scale defines the noise. The parameter `b` controls the slope and the amplitude is controlled by a constant plus a weighted function of climate variables.

(Note: the somewhat unusual parameterization of the growth curve was designed so that the parameter `c` allows the shape to interpolate between a simple logistic (for `c` of 1) and a sigmoid (for `c` greater than 1). For all values of `c`, the function evaluates to 0 when age is 0; for large age values, the function evaluates to the amplitude. Thus, the parameterization forces the function through the origin).

A Gamma distribution was used as the noise model, rather than a Gaussian, because of some basic statistical properties of the data: biomass is continuous, strictly positive, and its variance tends to grow with its mean. We confirmed that fitted model parameters were generally similar when using a Gaussian noise model, but samples from the fitted model were far closer to the measured data distribution when using the Gamma.

The model was fit independently to each of 112 forest types, with a median number of 1057 conditions per forest type (min of 60, max of 27874). To ensure that each forest type had 50 or more condition measurements, we aggregated some sparse forest types into more common ones (59 were so aggregated out of the initial set of 171). Each model was fit using all conditions from a given forest type regardless of their specific inventory year. We did not explicitly model the inventory year or whether a condition was inventoried repeatedly, i.e. conditions with repeated inventories were treated as independent samples. Our drought and insect models (described in the 'Drought and Insects' subsection) leverage repeated inventories explicitly.

All parameters were fit jointly using maximum likelihood as defined by the Gamma distribution. Constrained nonlinear optimization was performed in Python with the [`scipy.optimize.minimize` function](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html) using the `trust-constrained` algorithm. Parameters `a` and `b` were bounded below at 1e-5 and parameter `c` was bounded below at 1. Otherwise parameters were unbounded. Although the model was fit using maximum likelihood, for interpretability model performance was also assessed using `R²` between predicted and actual biomass, with a median of 0.29 across the 112 forest types, a minimum of 0.050, and a maximum of 0.63. In general, the effects of climatic variables in the model were weak, variable across forest types, and increased model performance only slightly. Average fitted parameters showed a positive relationship with precipitation (increased maximum amplitude of biomass with higher precipitation) and negative relationship with temperature (decreased maximum amplitude of biomass with higher temperatures), but these relationships were variable across forest types. While principled model selection might suggest dropping these variables from the model, we include them for comparability with our other models, all of which include climatic variables.

To predict future biomass, we "grew" forests starting in the year 2010 and proceeding in 10-year increments, based on fitted growth curves and climate data from CMIP6 projections (see below). We set the initial stand age based on the measured stand age plus the elapsed time between that measurement and 2010. For example, a condition that was inventoried in 1990 with a stand age of 35 would be assigned a starting age of 55 in 2010 (`t₀`), reflecting its growth since the latest measured stand age. Then, at each future timestep `t₁`, we computed a growth delta by predicting biomass with the climate in year `t₁` and the age in year `t₁` minus the biomass with the climate in year `t₁` and the age in year `t₀`. This delta was then added to the total biomass from year `t₀` to obtain a biomass in year `t₁`. We created the predictions at the condition level and then used gridded interpolation via the [`verde`](https://github.com/fatiando/verde) library to map the predictions to a common 4km grid. These estimates were finally scaled by multiplying by a raster of fractional forest area from the National Land Cover Database from 2016 (NLCD, see below), and thresholded to only show locations with forests exceeding 50%.

### Fire

We developed a statistical model predicting burned area as a function of climatic variables. Our work is inspired by, and builds, on that of Barbero et al. (2014). Many of the methods are similar, though updated with more recent data (through 2018 rather than 2010).

The model was fit to historical fire data from the Monitoring Trends in Burn Severity (MTBS) database (Eidenshink et al, 2007), preprocessed to extract a raster of burned area for each month, thresholded to only include moderate or severe fires. Our dependent variable was a (420) x (1209) x (783) raster of burned area per month, many entries of which were 0. Our primary climatic variables were mean temperature, precipitation, and climatic water deficit (CWD) derived from the TerraClimate dataset (Abatzoglou et al, 2018) for the historical period matched to the MTBS record (1984-2018). This resulted in a (3) x (420) x (1209) x (783) regressor raster.

For vegetation, we used the National Forest Type Dataset (NFTD, see below). To limit the number of variables, spatially sparse forest groups were aggregated into supersets by combining any forest group with spatial area less than 1.76M ha with the most spatially similar, larger forest group (areas ranged from 51k ha to 67M). This grouping removed 8 out of 25 groups, and had little effect on model behavior. Thus, the result of our preprocessing was a (17) x (1209) x (783) forest group regressor raster.

We fit a “hurdle” regression model to predict burned area as a function of climate and vegetation variables. This model jointly predicts the probability of a non-zero value and, if a non-zero value is present, its continuous value (Cragg, 1971).  Intuitively, this model can be thought of as combining a classifier (“was there fire?”) and a regression (“if there was fire, how large was the burned area?”).

We formally represented the hurdle model using a sequence of two generalized linear models: a Binomial model with logit link function predicting zero vs non-zero values, and a linear Gaussian model with normal link function predicting burn area in the locations where it was non-zero. We implemented the hurdle model in Python using scikit-learn by combining the LogisticRegression and LinearRegression methods (Pedregosa et al., 2011).

In addition to the variables described above, we included two additional regressors to better capture inter-annual trends, which the model might otherwise ignore given that variation within years is substantially greater than variation across years. To create this regressor we calculated a CONUS-average temperature and precipitation time series and then calculated, on a monthly rolling basis, the 12-month maximum temperature and precipitation time series. We used the resulting time series as a regressor which was the same at all locations but varied over time. Conceptually, the temperature regressor provides a measure of longer term drought stress than the short term monthly time series. The precipitation regressor captures the sharpness of precipitation regimes, which has been shown to amplify wildfire risk in California (Swain et al., 2020). 

In practice, including these extra regressors improved overall model performance only slightly, but allowed the model to better reproduce both monthly trends and the observed increase in burned area over the observation period, a large fraction of which has been attributed to climate change (Abatzoglou and Williams, 2016). Fire risk is thresholded to locations that are more than 50% forested according to NLCD 2016.

See the [GitHub repository](https://github.com/carbonplan/forest-risks) for all of the code to reproduce our results.

### Drought and Insects

Note: We are currently refining and validating these models. To ensure confidence in our projections, we are currently only showing historical maps for Drought and Insects, obtained by fitting the models described below and evaluating them on a historical period matched to the FIA record.

We aggregated FIA data on live and dead basal area from a tree-level to a 'condition' level, grouping together conditions representing repeated inventories of the same location. To construct drought and insect risk models, we screened for plots that had at least 2 inventory measurements, which enables estimating a true mortality rate. We next screened out plots that had a "fire" or "human" disturbance code or a "cutting" treatment code to remove major confounding disturbances. We estimated the fraction of mortality over a census interval, which we define as a pair of measurements in two successive years (t₀, t₁). 

The fraction of mortality is defined as the ratio of dead basal area in t₁ to the total live basal area in t₀, which was then normalized by the census length to give annual mortality rates. We computed this ratio separately for each condition. Given that several plots only had one repeated measure (only one census interval), we used the first census interval for all conditions. We modeled ‘drought-related’ mortality as the mortality that occurred during this census interval (with other confounding mortality drivers excluded, see above) and ‘insect-related’ mortality using the “agent code” (AGENTCD) tree-level data, where codes of 10-19 indicate insects as the primary causal agent of death. We note that the drought mortality models include mortality from insects, which was a deliberate decision because insects and drought often co-occur and interact to kill trees in many forests across the US (Anderegg et al. 2015). We also included stand and self-thinning dynamics in model construction (see below). 

We fit a statistical model predicting mortality as a function of climatic and stand variables. Given the large prevalence of zeros in our mortality data, we modeled mortality using a "hurdle" model as described in the fire model description, differing only in that the linear model for predicting non-zero values used a beta-distributed (as opposed to Gaussian) link function. The beta-distributed link function for the linear regression was chosen based on inspecting the behavior of the raw data distributions. We implemented the hurdle model in R using the ‘glm’ and ‘betareg’ packages (Cribri-Neto and Zeileis, 2010). 

For each condition, we extracted the mean, minimum, and maximum over the census interval for six annual climate variables that were selected based on their importance in the drought and insect mortality literature: precipitation, temperature, palmer drought severity index (PDSI), potential evapotranspiration (PET), climatic water deficit (CWD), and vapor pressure deficit (VPD) (Bentz et al. 2010; Williams et al. 2013; Creeden et al. 2014; Anderegg et al. 2015; Grossiard et al. 2020). We also extracted the stand age for each condition from FIA and the community-weighted mean and range of the functional trait of the water potential at 50% loss of hydraulic conductivity (P50) from 0.25 degree maps published in a recent study (Trugman et al. 2020). This trait has been widely linked to drought-driven mortality risk in site-level studies (Urli et al. 2013; Nardini et al. 2015) and meta-analyses (Anderegg et al. 2016). We also included in the mortality models two stand variables of age or age-squared to account for background ecological dynamics such as self-thinning and background mortality, following Hember et al. (2017). All predictor variables were z-scored across the full dataset for that variable to ensure that variable ranges did not drive model outputs. 

Drought and insect mortality models were fit independently for each forest type, which was chosen as an intermediate compromise to capture the diversity of responses across US forests but aggregate above a species-level to adequately estimate mortality levels. To ensure that each forest type had 50 or more condition measurements, we aggregated some sparse forest types into more common ones (59 were so aggregated out of the initial set of 171), leading to 112 initial forest types in our dataset. Because FIA plots are inherently small and may not estimate accurate mortality rates at a plot-level, we subsequently aggregated condition-level mortality rates, age, climate data, and functional traits to a 0.25 degree grid for each forest type. This grid size was chosen through sensitivity analyses to determine the optimal aggregation where the coefficient of variation of mortality rate stabilized but large-scale climate variation was preserved. All drought and insect mortality models were fit on this 0.25 degree grid. Model predictions were then conducted at the condition level and interpolated to the 4km grid as with biomass.

Finally, we imposed one further set of criteria on drought and insect models to project risks only where our models showed robust performance. For any forest types with fewer than 20 grid cells featuring mortality observed in the historical record, or where cross-validated AUC was less than 0.6, we set the historical mortality equal to the mean of observed mortality for that forest type. This constraint led to risks being modeled as a function of climate variables for 23 forest types in the insect models and 53 forest types in the drought models. As with biomass and fire, drought and insect risks are only shown for regions which were greater than 50% forested according to the National Land Cover Database (NLCD, see below)

## Data sources

### FIA

The Forest Inventory and Analysis dataset is a nationwide survey from a series of long-term forest monitoring plots that the United States Forest service uses to monitor the growth, mortality, and overall health of US forests.

Our analysis relied on two components of the FIA database: tree-level measurements and condition-level measurements. From the raw, per-tree measurements, we calculated a series of condition-level summary statistics (such as total living basal area and above ground biomass) and combined these with other condition-level summaries from the database. Some analyses (biomass) used all conditions directly, whereas for other analyses (drought, insects) we grouped conditions across repeated measurements (i.e., across surveys). These preprocessed data served as a common basis for all biomass and risk modeling. For all analyses, we only included conditions with a "condition proportion" greater than 0.3, which means that the condition represented at least 30% of its corresponding plot.

We downloaded FIA data from the [FIA Data Mart in CSV format](https://apps.fs.usda.gov/fia/datamart/CSV/datamart_csv.html).

### NFTD

The National Forest Type Dataset, based upon FIA, is a collection of rasters which encode the most common forest type and forest group at 250 m. For each forest group, we constructed a raster resampled to the same 4-km grid encoding, for each grid cell, the fraction of that forest group present. 

We downloaded NFTD data from the [FSGeodata Clearinghouse](https://data.fs.usda.gov/geodata/rastergateway/forest_type/).

### MTBS

The Monitoring Trends in Burn Severity (MTBS) dataset includes 30m annual rasters of burn severity as well as burned area boundary polygons for individual fires (Eidenshink et al, 2007). The dataset covers fires from 1984-2018 and includes fires larger than 500 acres (1000 acres in the Western U.S.) for the continental U.S., Alaska, Hawaii, and Puerto Rico.

For our analysis, we primarily used the fire boundaries dataset, creating monthly rasters of burned-area on our 4 km grid by rasterizing fire polygons within each month, and then masking all months in a given year to only include moderate and severe fires as defined by the annual thematic raster. See the [MTBS rasterization notebook](https://github.com/carbonplan/data/tree/master/scripts/mtbs) for a detailed description of the rasterization process.

### NLCD

The National Land Cover Database (NLCD; Dewitz (2019)) includes 30 m land cover classification rasters at 2-3-year intervals (from 2001-2016). Separate raster datasets are available for the contiguous U.S. and Alaska.

Our processing of the NLCD dataset included downsampling the categorical data from 30m to 4km resolution. For each of the 20 land cover categories of interest (11, 12, 21, 22, 23, 24, 31, 41, 42, 43, 51, 52, 71, 72, 73, 74, 81, 82, 90, 95), we extract a binary coverage mask, then upscale the high resolution raster using the arithmetic mean. The downsampling process results in fractional coverage 4km rasters for each of the 20 land cover categories. See the [NLCD downsampling and reprojection notebook](https://github.com/carbonplan/data/blob/master/scripts/nlcd/02_downsampling_and_reprojection.ipynb) for specific details of the process.

### TerraClimate

The TerraClimate dataset provides monthly climate and climatic water balance terms (Abatzoglou et al, 2018). The dataset extent includes all land areas in the domain on a global 1/24th degree grid from 1958-2019.

To process the TerraClimate dataset, we regridded the data from its global 1/24th degree grid to our 4km project grid using [Xesmf’s](https://xesmf.readthedocs.io/en/latest/index.html) bilinear interpolation.

### CMIP6

Future projections of biomass and fire risk were made using climate model data from the Coupled Model Intercomparison Project Phase 6 (CMIP6; Eyring et al, 2016). We used the Pangeo Project’s archive of the CMIP6 dataset available on [Google Cloud Platform](https://console.cloud.google.com/marketplace/product/noaa-public/cmip6?_ga=2.46871527.-1119720002.1551810800). For our analysis, we extracted monthly mean fields for the variables precipitation (pr), minimum daily temperature (tasmin), and maximum daily temperature (tasmax), and relative humidity (shum). Of the available data, we selected 6 climate models (CanESM5-CanOE, MIROC-ES2L, ACCESS-CM2, ACCESS-ESM1-5, MRI-ESM2-0, MPI-ESM1-2-LR) and 3 SSPs (2-4.5, 3-7.0, 5-8.5) based on data availability as of February 2020.

Our processing of the individual CMIP6 datasets included regridding the data from its native global grid to our 4km grid. This process was done using [Xesmf’s](https://xesmf.readthedocs.io/en/latest/index.html) bilinear interpolation.

### Downscaling

Data from climate models, like those included in CMIP6, frequently have significant biases that need to be corrected prior to use in impacts modeling studies like ours. These biases are due to both the models’ coarse spatial resolution and model errors. The downscaling and bias correction process is meant to correct the systemic biases in climate models, while preserving the underlying climate signals (e.g. warming or drying trends). Our team has been developing a collection of statistical downscaling methods in the open source Python package [Scikit-Downscale](https://scikit-downscale.readthedocs.io/).

Our work here has included the evaluation of multiple downscaling methods for the applications of modeling biomass, fire, insects, and drought and the production of multiple open-access datasets. See the [carbonplan/cmip6-downscaling](https://github.com/carbonplan/cmip6-downscaling) project for more information on existing and work-in-progress methods and datasets.

The maps shown here are based on CMIP6 data with quantile mapping bias correction. Quantile mapping is widely used in the climate downscaling literature with a variety of implementations depending on the application (Wood et al 2004; Li et al 2010; Maraun 2013; Cannon, Sobie, and Murdock 2015). For this study, we performed a simple form of single-variable trend-preserving quantile mapping to correct for persistent biases in the raw CMIP6 climate model output, matching the statistical distribution of the TerraClimate dataset on a gridcell by gridcell basis. Using the Scikit-downscale package (Hamman and Kent, 2020), the quantile mapping procedure was implemented for each variable and grid cell as follows. The process begins by extracting three time series: `X` historical (i.e. CMIP), `y` observed (i.e. TerraClimate), and `X’` modeled (i.e. CMIP or ScenarioMIP), and by removing their trends. Empirical CDFs are then calculated for all three time series using Cunnane plotting positions. The CDF from `X’` is then interpolated onto the CDF of `X` using one-dimensional piecewise linear interpolation, thus correcting for statistical differences between the `X` and `X’`. The mapping from `X` to `y` is performed by again using one-dimensional piecewise linear interpolation. Finally, the trend from `X’` is reimposed to the resulting vector of quantile mapped data. Precipitation was treated in a multiplicative way while temperature was treated in an additive way.

Though this method is performed on monthly data, we still take care to handle extreme values in a reasonable way. As implemented in our study, we take the common approach of applying the proportional differences between `X’` and `X` for all values outside the bounds of the training data.

## Acknowledgements

These data products and the website were developed jointly by the following contributors (in alphabetical order): Bill Anderegg (University of Utah), Grayson Badgley (Black Rock Forest / Columbia University), Oriana Chegwidden (CarbonPlan), Jeremy Freeman (CarbonPlan), Joe Hamman (CarbonPlan), Jake Mensch (volunteer), Anna Trugman (UC Santa Barbara).

The development of this project was funded, in part, through a grant from the Microsoft AI for Earth program to CarbonPlan.

## References

Abatzoglou et al. (2018) Terraclimate, a high-resolution global dataset of monthly climate and climatic water balance from 1958-2015, Scientific Data, [DOI](https://doi.org/10.1038/sdata.2017.191)

Abatzoglou and Williams (2016) Impact of anthropogenic climate change on wildfire across western US forests, PNAS, [DOI](https://doi.org/10.1073/pnas.1607171113)

Anderson-Teixeira, K. et al. (2012) Climate-regulation services of natural and agricultural ecoregions of the Americas, Nature Climate Change, [DOI](https://doi.org/10.1038/nclimate1346)

Barbero et al. (2015) Multi‐scalar influence of weather and climate on very large‐fires in the Eastern United States, Environmental Research Letters, [DOI](http://dx.doi.org/10.1088/1748-9326/9/12/124009)

Cannon et al. (2015) Bias Correction of GCM Precipitation by Quantile Mapping: How Well Do Methods Preserve Changes in Quantiles and Extremes?, Journal of Climate, [DOI](https://doi.org/10.1175/JCLI-D-14-00754.1)

Cragg (1971) Some Statistical Models for Limited Dependent Variables with Application to the Demand for Durable Goods, Econometrica, [DOI](http://dx.doi.org/10.2307/1909582)

Cribari-Neto F, Zeileis A (2010). “Beta Regression in R.” Journal of Statistical Software, 1–24.  [DOI](http://dx.doi.org/10.18637/jss.v034.i02)

Eidenshink et al. (2007) A project for monitoring trends in burn severity, Fire Ecology, [DOI](https://doi.org/10.4996/fireecology.0301003)

Eyring et al. (2016) Overview of the Coupled Model Intercomparison Project Phase 6 (CMIP6) experimental design and organization, Geoscience Model Development, [DOI](https://doi.org/10.5194/gmd-9-1937-2016)

Gillespie (1999) Rationale for a national annual forest inventory program, Journal of Forestry, [URL](https://academic.oup.com/jof/article/97/12/16/4613993)

Hember et al. (2017) Relationships between individual‐tree mortality and water‐balance variables indicate positive trends in water stress‐induced tree mortality across North America, Global Change Biology, [DOI](https://doi.org/10.1111/gcb.13428)

Li, H et al. (2010) Bias correction of monthly precipitation and temperature fields from Intergovernmental Panel on Climate Change AR4 models using equidistant quantile matching, Journal of Geophysica Research, [DOI](https://doi.org/10.1029/2009JD012882) 

Maraun et al (2015) VALUE: A framework to validate downscaling approaches for climate change studies, Earth's Future [DOI](https://doi.org/10.1002/2014EF000259).

Pedregosa et al. (2011) Scikit-learn: Machine Learning in Python, JMLR, [DOI](http://jmlr.csail.mit.edu/papers/v12/pedregosa11a.html)

Ruefenacht, et al. (2008) Conterminous U.S. and Alaska Forest Type Mapping Using Forest Inventory and Analysis Data, American Society of Photogrammetry, [URL](https://data.fs.usda.gov/geodata/rastergateway/forest_type/)

Wood, A.W., et al. (2004) Hydrologic Implications of Dynamical and Statistical Approaches to Downscaling Climate Model Outputs, Climatic Change, [DOI](https://doi.org/10.1023/B:CLIM.0000013685.99609.9e)

Zhu et al. (2018) Global biomass density of potential wild large grazers for present-day and the last glacial maximum, simulated by a DGVM model, PANGAEA, [DOI](https://doi.org/10.1594/PANGAEA.884853)

export default ({ children }) => <Box>{children}</Box>