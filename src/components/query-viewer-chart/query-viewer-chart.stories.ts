import { parseDataXML, parseMetadataXML } from "@genexus/reporting-api";
import {
  QueryViewerChartType,
  QueryViewerPlotSeries,
  QueryViewerXAxisLabels,
  QueryViewerOutputType,
  QueryViewerShowDataAs,
  QueryViewerOrientation,
  QueryViewerMapType,
  QueryViewerRegion,
  QueryViewerContinent,
  QueryViewerCountry,
  QueryViewerShowDataLabelsIn,
  QueryViewerTotal,
} from "@genexus/reporting-api";
import { QueryViewerServiceResponse } from "@genexus/reporting-api";
import type { Meta, StoryObj } from "@storybook/web-components";


const serviceMock: QueryViewerServiceResponse = {
  MetaData: parseMetadataXML("<?xml version = \"1.0\" encoding = \"UTF-8\"?>\n\r\n<OLAPCube Version=\"2\" format=\"compact\" decimalSeparator=\".\" thousandsSeparator=\",\" dateFormat=\"MDY\" textForNullValues=\"\" forceDefaultView=\"yes\" ShowDataLabelsIn=\"\">\n\t<OLAPDimension name=\"CountryISO\" displayName=\"Country ISO\" description=\"Country ISO\" dataField=\"F1\" visible=\"Yes\" axis=\"Rows\" canDragToPages=\"true\" summarize=\"yes\" align=\"left\" picture=\"\" dataType=\"character\" format=\"\">\n\t</OLAPDimension>\n\t<OLAPMeasure name=\"Element2\" displayName=\"Sum of Country Population\" description=\"Sum of Country Population\" dataField=\"F2\" visible=\"Yes\" aggregation=\"sum\" align=\"right\" picture=\"ZZZ,ZZZ,ZZZ,ZZ9\" targetValue=\"0\" maximumValue=\"0\" dataType=\"integer\" format=\"\">\n\t</OLAPMeasure>\n</OLAPCube>\n"),
  Data: parseDataXML("<?xml version = \"1.0\" encoding = \"UTF-8\"?>\n\r\n<Recordset RecordCount=\"200\" PageCount=\"1\">\n\t<Page PageNumber=\"1\">\n\t\t<Record>\n\t\t\t<F1>AE                  </F1>\n\t\t\t<F2>9991083</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>AF                  </F1>\n\t\t\t<F2>39835428</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>AG                  </F1>\n\t\t\t<F2>98728</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>AI                  </F1>\n\t\t\t<F2>15125</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>AL                  </F1>\n\t\t\t<F2>2872934</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>AM                  </F1>\n\t\t\t<F2>2968128</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>AO                  </F1>\n\t\t\t<F2>33933611</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>AR                  </F1>\n\t\t\t<F2>45605823</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>AT                  </F1>\n\t\t\t<F2>9043072</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>AU                  </F1>\n\t\t\t<F2>25788217</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>AZ                  </F1>\n\t\t\t<F2>10223344</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BA                  </F1>\n\t\t\t<F2>3263459</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BB                  </F1>\n\t\t\t<F2>287708</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BD                  </F1>\n\t\t\t<F2>166303494</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BE                  </F1>\n\t\t\t<F2>11632334</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BF                  </F1>\n\t\t\t<F2>21497097</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BG                  </F1>\n\t\t\t<F2>6896655</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BH                  </F1>\n\t\t\t<F2>1748295</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BI                  </F1>\n\t\t\t<F2>12255429</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BJ                  </F1>\n\t\t\t<F2>12451031</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BM                  </F1>\n\t\t\t<F2>62092</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BN                  </F1>\n\t\t\t<F2>441532</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BO                  </F1>\n\t\t\t<F2>11832936</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BR                  </F1>\n\t\t\t<F2>213993441</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BS                  </F1>\n\t\t\t<F2>396914</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BT                  </F1>\n\t\t\t<F2>779900</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BW                  </F1>\n\t\t\t<F2>2397240</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BY                  </F1>\n\t\t\t<F2>9442867</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>BZ                  </F1>\n\t\t\t<F2>404915</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CA                  </F1>\n\t\t\t<F2>38067913</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CD                  </F1>\n\t\t\t<F2>92377986</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CF                  </F1>\n\t\t\t<F2>4919987</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CG                  </F1>\n\t\t\t<F2>5657017</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CH                  </F1>\n\t\t\t<F2>8715494</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CI                  </F1>\n\t\t\t<F2>27053629</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CK                  </F1>\n\t\t\t<F2>17572</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CL                  </F1>\n\t\t\t<F2>19212362</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CM                  </F1>\n\t\t\t<F2>27224262</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CN                  </F1>\n\t\t\t<F2>1444216102</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CO                  </F1>\n\t\t\t<F2>51265841</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CR                  </F1>\n\t\t\t<F2>5139053</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CU                  </F1>\n\t\t\t<F2>11317498</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CV                  </F1>\n\t\t\t<F2>561901</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CY                  </F1>\n\t\t\t<F2>896005</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>CZ                  </F1>\n\t\t\t<F2>10724553</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>DE                  </F1>\n\t\t\t<F2>83900471</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>DJ                  </F1>\n\t\t\t<F2>1002197</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>DK                  </F1>\n\t\t\t<F2>5813302</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>DM                  </F1>\n\t\t\t<F2>72172</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>DO                  </F1>\n\t\t\t<F2>10953714</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>DZ                  </F1>\n\t\t\t<F2>44616626</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>EC                  </F1>\n\t\t\t<F2>17888474</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>EE                  </F1>\n\t\t\t<F2>1325188</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>EG                  </F1>\n\t\t\t<F2>104258327</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>ER                  </F1>\n\t\t\t<F2>3601462</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>ES                  </F1>\n\t\t\t<F2>46745211</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>ET                  </F1>\n\t\t\t<F2>117876226</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>FI                  </F1>\n\t\t\t<F2>5548361</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>FJ                  </F1>\n\t\t\t<F2>902899</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>FM                  </F1>\n\t\t\t<F2>116255</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>FO                  </F1>\n\t\t\t<F2>49053</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>FR                  </F1>\n\t\t\t<F2>67422000</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GA                  </F1>\n\t\t\t<F2>2278829</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GB                  </F1>\n\t\t\t<F2>68207114</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GD                  </F1>\n\t\t\t<F2>113015</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GE                  </F1>\n\t\t\t<F2>3979773</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GH                  </F1>\n\t\t\t<F2>31732128</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GL                  </F1>\n\t\t\t<F2>56868</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GM                  </F1>\n\t\t\t<F2>2486937</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GN                  </F1>\n\t\t\t<F2>13497237</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GQ                  </F1>\n\t\t\t<F2>1449891</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GR                  </F1>\n\t\t\t<F2>10370747</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GT                  </F1>\n\t\t\t<F2>18249868</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GW                  </F1>\n\t\t\t<F2>2015490</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>GY                  </F1>\n\t\t\t<F2>790329</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>HN                  </F1>\n\t\t\t<F2>10062994</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>HR                  </F1>\n\t\t\t<F2>4081657</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>HT                  </F1>\n\t\t\t<F2>11541683</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>HU                  </F1>\n\t\t\t<F2>9634162</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>ID                  </F1>\n\t\t\t<F2>276361788</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>IE                  </F1>\n\t\t\t<F2>4982904</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>IL                  </F1>\n\t\t\t<F2>9291000</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>IN                  </F1>\n\t\t\t<F2>1393409033</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>IQ                  </F1>\n\t\t\t<F2>41179351</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>IR                  </F1>\n\t\t\t<F2>85028760</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>IS                  </F1>\n\t\t\t<F2>368792</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>IT                  </F1>\n\t\t\t<F2>60367471</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>JM                  </F1>\n\t\t\t<F2>2973462</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>JO                  </F1>\n\t\t\t<F2>10269022</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>JP                  </F1>\n\t\t\t<F2>126050796</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>KE                  </F1>\n\t\t\t<F2>54985702</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>KG                  </F1>\n\t\t\t<F2>6628347</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>KH                  </F1>\n\t\t\t<F2>16946446</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>KI                  </F1>\n\t\t\t<F2>121388</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>KM                  </F1>\n\t\t\t<F2>888456</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>KN                  </F1>\n\t\t\t<F2>53546</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>KR                  </F1>\n\t\t\t<F2>51305184</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>KW                  </F1>\n\t\t\t<F2>4328553</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>KZ                  </F1>\n\t\t\t<F2>18994958</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>LA                  </F1>\n\t\t\t<F2>7379358</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>LB                  </F1>\n\t\t\t<F2>6769151</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>LC                  </F1>\n\t\t\t<F2>184401</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>LI                  </F1>\n\t\t\t<F2>38254</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>LK                  </F1>\n\t\t\t<F2>21497306</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>LR                  </F1>\n\t\t\t<F2>5180208</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>LS                  </F1>\n\t\t\t<F2>2159067</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>LT                  </F1>\n\t\t\t<F2>2689862</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>LU                  </F1>\n\t\t\t<F2>634814</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>LV                  </F1>\n\t\t\t<F2>1866934</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>LY                  </F1>\n\t\t\t<F2>6958538</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MA                  </F1>\n\t\t\t<F2>37344787</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MC                  </F1>\n\t\t\t<F2>39520</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MD                  </F1>\n\t\t\t<F2>4024025</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>ME                  </F1>\n\t\t\t<F2>628051</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MG                  </F1>\n\t\t\t<F2>28427333</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MH                  </F1>\n\t\t\t<F2>59618</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MK                  </F1>\n\t\t\t<F2>2082661</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>ML                  </F1>\n\t\t\t<F2>20855724</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MM                  </F1>\n\t\t\t<F2>54806014</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MN                  </F1>\n\t\t\t<F2>3329282</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MR                  </F1>\n\t\t\t<F2>4775110</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MT                  </F1>\n\t\t\t<F2>516100</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MU                  </F1>\n\t\t\t<F2>1273428</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MV                  </F1>\n\t\t\t<F2>543620</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MW                  </F1>\n\t\t\t<F2>19647681</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MX                  </F1>\n\t\t\t<F2>130262220</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MY                  </F1>\n\t\t\t<F2>32776195</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>MZ                  </F1>\n\t\t\t<F2>32163045</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>NA                  </F1>\n\t\t\t<F2>2587344</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>NE                  </F1>\n\t\t\t<F2>25130810</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>NG                  </F1>\n\t\t\t<F2>211400704</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>NI                  </F1>\n\t\t\t<F2>6702379</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>NL                  </F1>\n\t\t\t<F2>17173094</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>NO                  </F1>\n\t\t\t<F2>5465629</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>NP                  </F1>\n\t\t\t<F2>29674920</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>NR                  </F1>\n\t\t\t<F2>10873</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>NZ                  </F1>\n\t\t\t<F2>5126300</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>OM                  </F1>\n\t\t\t<F2>5223376</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>PA                  </F1>\n\t\t\t<F2>4381583</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>PE                  </F1>\n\t\t\t<F2>33359415</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>PG                  </F1>\n\t\t\t<F2>9119005</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>PH                  </F1>\n\t\t\t<F2>111046910</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>PK                  </F1>\n\t\t\t<F2>225199929</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>PL                  </F1>\n\t\t\t<F2>37797000</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>PS                  </F1>\n\t\t\t<F2>5222756</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>PT                  </F1>\n\t\t\t<F2>10167923</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>PY                  </F1>\n\t\t\t<F2>7219641</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>QA                  </F1>\n\t\t\t<F2>2930524</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>RO                  </F1>\n\t\t\t<F2>19127772</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>RS                  </F1>\n\t\t\t<F2>6871547</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>RU                  </F1>\n\t\t\t<F2>145912022</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>RW                  </F1>\n\t\t\t<F2>13276517</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SA                  </F1>\n\t\t\t<F2>35340680</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SB                  </F1>\n\t\t\t<F2>703995</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SC                  </F1>\n\t\t\t<F2>98910</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SD                  </F1>\n\t\t\t<F2>44909351</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SE                  </F1>\n\t\t\t<F2>10160159</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SG                  </F1>\n\t\t\t<F2>5453600</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SI                  </F1>\n\t\t\t<F2>2078723</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SK                  </F1>\n\t\t\t<F2>5449270</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SL                  </F1>\n\t\t\t<F2>8141343</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SM                  </F1>\n\t\t\t<F2>34010</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SN                  </F1>\n\t\t\t<F2>17196308</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SO                  </F1>\n\t\t\t<F2>16359500</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SR                  </F1>\n\t\t\t<F2>591798</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SS                  </F1>\n\t\t\t<F2>11381377</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>ST                  </F1>\n\t\t\t<F2>223364</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SV                  </F1>\n\t\t\t<F2>6518500</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SY                  </F1>\n\t\t\t<F2>18275704</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>SZ                  </F1>\n\t\t\t<F2>1172369</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TD                  </F1>\n\t\t\t<F2>16914985</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TG                  </F1>\n\t\t\t<F2>8478242</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TH                  </F1>\n\t\t\t<F2>69950844</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TJ                  </F1>\n\t\t\t<F2>9749625</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TL                  </F1>\n\t\t\t<F2>1343875</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TM                  </F1>\n\t\t\t<F2>6117933</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TN                  </F1>\n\t\t\t<F2>11935764</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TO                  </F1>\n\t\t\t<F2>106759</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TR                  </F1>\n\t\t\t<F2>85042736</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TT                  </F1>\n\t\t\t<F2>1403374</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TV                  </F1>\n\t\t\t<F2>11925</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TW                  </F1>\n\t\t\t<F2>23855008</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>TZ                  </F1>\n\t\t\t<F2>61498438</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>UA                  </F1>\n\t\t\t<F2>43466822</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>UG                  </F1>\n\t\t\t<F2>47123533</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>US                  </F1>\n\t\t\t<F2>332915074</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>UY                  </F1>\n\t\t\t<F2>3485152</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>UZ                  </F1>\n\t\t\t<F2>33935765</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>VA                  </F1>\n\t\t\t<F2>812</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>VC                  </F1>\n\t\t\t<F2>111269</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>VE                  </F1>\n\t\t\t<F2>28704947</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>VG                  </F1>\n\t\t\t<F2>30423</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>VN                  </F1>\n\t\t\t<F2>98168829</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>VU                  </F1>\n\t\t\t<F2>314464</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>WS                  </F1>\n\t\t\t<F2>200144</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>XK                  </F1>\n\t\t\t<F2>1782115</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>YE                  </F1>\n\t\t\t<F2>30490639</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>ZA                  </F1>\n\t\t\t<F2>60041996</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>ZM                  </F1>\n\t\t\t<F2>18920657</F2>\n\t\t</Record>\n\t\t<Record>\n\t\t\t<F1>ZW                  </F1>\n\t\t\t<F2>15092171</F2>\n\t\t</Record>\n\t</Page>\n</Recordset>\n"),
  Properties: {
    "id": "56c822c5-923c-4250-ab90-6cf6f9197d1e",
    "name": "PopulationByCountry",
    "description": "Population By Country",
    "expression": "Query PopulationByCountry [OutputType='Map']\r\n{\r\n\tCountryISO [Name='CountryISO', UseDomainDescriptions='False']\r\n\tSum(CountryPopulation) [Name='Element2', Picture='ZZZ,ZZZ,ZZZ,ZZ9']\r\n}",
    "modified": "2023-12-28T20:34:09",
    "removeDuplicates": false,
    "maxRows": "",
    "textForNullValues": "",
    "outputType": QueryViewerOutputType.Map,
    "title": "",
    "showValues": true,
    "showDataAs": QueryViewerShowDataAs.Values,
    "orientation": QueryViewerOrientation.Horizontal,
    "includeTrend": false,
    "includeSparkline": false,
    "includeMaxAndMin": false,
    "chartType": QueryViewerChartType.Column,
    "plotSeries": QueryViewerPlotSeries.InTheSameChart,
    "xAxisLabels": QueryViewerXAxisLabels.Horizontally,
    "xAxisIntersectionAtZero": false,
    "xAxisTitle": "",
    "yAxisTitle": "",
    "mapType": QueryViewerMapType.Choropleth,
    "region": QueryViewerRegion.World,
    "continent": QueryViewerContinent.NorthAmerica,
    "country": QueryViewerCountry.UnitedStatesOfAmerica,
    "paging": true,
    "pageSize": 20,
    "showDataLabelsIn": QueryViewerShowDataLabelsIn.Columns,
    "totalForRows": QueryViewerTotal.Yes,
    "totalForColumns": QueryViewerTotal.Yes,
  },
  XML: null
};

const meta: Meta<HTMLGxQueryViewerElement> = {
  component: "gx-query-viewer",
  argTypes: {
    chartType: {
      options: [
        "Column",
        "Column3D",
        "StackedColumn",
        "StackedColumn3D",
        "StackedColumn100",
        "Bar",
        "StackedBar",
        "StackedBar100",
        "Area",
        "StackedArea",
        "StackedArea100",
        "SmoothArea",
        "StepArea",
        "Line",
        "StackedLine",
        "StackedLine100",
        "SmoothLine",
        "StepLine",
        "Pie",
        "Pie3D",
        "Doughnut",
        "Doughnut3D",
        "LinearGauge",
        "CircularGauge",
        "Radar",
        "FilledRadar",
        "PolarArea",
        "Funnel",
        "Pyramid",
        "ColumnLine",
        "Column3DLine",
        "Timeline",
        "SmoothTimeline",
        "StepTimeline",
        "Sparkline"],
      control: {
        type: 'select'
      },
      defaultValue: "Column"
    },
    xAxisLabels: {
      options: [
        "Horizontally",
        "Rotated30",
        "Rotated45",
        "Rotated60",
        "Vertically"
      ],
      control: {
        type: 'select'
      },
      defaultValue: "Column"
    },
    plotSeries: {
      options: ["InTheSameChart", "InSeparateCharts"],
      control: {
        type: 'select'
      },
      defaultValue: "InTheSameChart"
    }
  },
  args: {
    type: QueryViewerOutputType.Chart,
    serviceResponse: serviceMock,
  }
};
export default meta;

type ChartStory = StoryObj<HTMLGxQueryViewerChartElement & { allowSelection: boolean; queryTitle: string; }>;

export const MultipleDataChart: ChartStory = {
  name: "Population By Country",
  args: {
    chartType: QueryViewerChartType.Column,
    plotSeries: QueryViewerPlotSeries.InTheSameChart,
    xAxisIntersectionAtZero: false,
    xAxisLabels: QueryViewerXAxisLabels.Horizontally,
    xAxisTitle: "",
    yAxisTitle: "",
    allowSelection: false,
    queryTitle: "Single data chart"
  },
  parameters: {
    controls: { exclude: ['type'] }
  }
};

