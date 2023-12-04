import type { Meta, StoryObj } from "@storybook/web-components";

const serviceResponseCardMock = {
  MetaData: {
    TextForNullValues: "",
    Axes: [
      {
        Name: "Element4",
        Title: "Booleano",
        DataField: "F4",
        DataType: "boolean",
        Visible: "Yes",
        Axis: "Rows",
        CanDragToPages: true,
        RaiseItemClick: true,
        IsComponent: false,
        Style: "",
        Subtotals: "Yes",
        Filter: {
          Type: "ShowAllValues",
          Values: []
        },
        ExpandCollapse: {
          Type: "ExpandAllValues",
          Values: []
        },
        Order: {
          Type: "None",
          Values: []
        },
        ValuesStyles: []
      },
      {
        Name: "Element5",
        Title: "Fecha",
        DataField: "F5",
        DataType: "date",
        Visible: "Yes",
        Axis: "Rows",
        Picture: "99/99/99",
        CanDragToPages: true,
        RaiseItemClick: true,
        IsComponent: false,
        Style: "",
        Subtotals: "Yes",
        Filter: {
          Type: "ShowAllValues",
          Values: []
        },
        ExpandCollapse: {
          Type: "ExpandAllValues",
          Values: []
        },
        Order: {
          Type: "None",
          Values: []
        },
        ValuesStyles: []
      },
      {
        Name: "Element6",
        Title: "Fecha Hora",
        DataField: "F6",
        DataType: "datetime",
        Visible: "Yes",
        Axis: "Rows",
        Picture: "99/99/99 99:99",
        CanDragToPages: true,
        RaiseItemClick: true,
        IsComponent: false,
        Style: "",
        Subtotals: "Yes",
        Filter: {
          Type: "ShowAllValues",
          Values: []
        },
        ExpandCollapse: {
          Type: "ExpandAllValues",
          Values: []
        },
        Order: {
          Type: "None",
          Values: []
        },
        ValuesStyles: []
      }
    ],
    Data: [
      {
        Name: "Element1",
        Title: "Entero",
        DataField: "F1",
        Aggregation: "",
        DataType: "integer",
        Visible: "Yes",
        Picture: "ZZZZZZZZZZZZZZ9",
        RaiseItemClick: true,
        IsComponent: false,
        TargetValue: 100,
        MaximumValue: 100,
        Style: "",
        ConditionalStyles: [],
        IsFormula: false,
        Formula: ""
      },
      {
        Name: "Element2",
        Title: "Decimal",
        DataField: "F2",
        Aggregation: "",
        DataType: "real",
        Visible: "Yes",
        Picture: "ZZZZZZZZZZZZZZ9",
        RaiseItemClick: true,
        IsComponent: false,
        TargetValue: 100,
        MaximumValue: 100,
        Style: "",
        ConditionalStyles: [],
        IsFormula: false,
        Formula: ""
      }
    ]
  },
  Data: {
    Rows: [
      {
        F4: "False",
        F5: "2022-02-02",
        F6: "2022-02-02 02:02:02",
        F1: "2",
        F2: "2.22",
        F3: "BR                  "
      },
      {
        F4: "False",
        F5: "2022-03-03",
        F6: "2022-03-03 03:03:03",
        F1: "3",
        F2: "3.33",
        F3: "BR                  "
      },
      {
        F4: "False",
        F5: "2022-04-04",
        F6: "2022-04-04 04:04:04",
        F1: "4",
        F2: "4.44",
        F3: "PY                  "
      },
      {
        F4: "True",
        F5: "2022-01-01",
        F6: "2022-01-01 01:01:01",
        F1: "1",
        F2: "1.11",
        F3: "UY                  "
      },
      {
        F4: "True",
        F5: "2022-05-05",
        F6: "2022-05-05 05:05:05",
        F1: "5",
        F2: "5.55",
        F3: "CL                  "
      },
      {
        F4: "True",
        F5: "2022-06-06",
        F6: "2022-06-06 06:06:06",
        F1: "6",
        F2: "6.66",
        F3: "BO                  "
      }
    ]
  }
};
const serviceResponseChartMock = {
  MetaData: {
    TextForNullValues: "",
    Axes: [
      {
        Name: "Element2",
        Title: "Country",
        DataField: "F1",
        DataType: "character",
        Visible: "Yes",
        Axis: "Rows",
        CanDragToPages: true,
        RaiseItemClick: true,
        IsComponent: false,
        Style: "",
        Subtotals: "Yes",
        Filter: {
          Type: "ShowSomeValues",
          Values: [
            "Afghanistan",
            "Albania",
            "Algeria",
            "Angola",
            "Anguilla",
            "Antigua and Barbuda",
            "Argentina",
            "Armenia",
            "Australia",
            "Austria",
            "Barbados",
            "Belarus",
            "Bulgaria",
            "Denmark",
            "Hungary",
            "Madagascar",
            "Marshall Islands",
            "Azerbaijan",
            "Bahamas",
            "Bahrain",
            "Bangladesh",
            "Belgium",
            "Belize",
            "Benin",
            "Bermuda",
            "Bhutan",
            "Bolivia",
            "Bosnia and Herzegovina",
            "Botswana",
            "Brazil",
            "British Virgin Islands",
            "Brunei",
            "Burkina Faso",
            "Burundi",
            "Cambodia",
            "Cameroon",
            "Canada",
            "Cape Verde",
            "Central African Republic",
            "Chad",
            "Chile",
            "China",
            "Colombia",
            "Comoros",
            "Congo",
            "Cook Islands",
            "Costa Rica",
            "Cote d'Ivoire",
            "Croatia",
            "Cuba",
            "Cyprus",
            "Czechia",
            "Democratic Republic of Congo",
            "Djibouti",
            "Dominica",
            "Dominican Republic",
            "Ecuador",
            "Egypt",
            "El Salvador",
            "Equatorial Guinea",
            "Eritrea",
            "Estonia",
            "Eswatini",
            "Ethiopia",
            "Faeroe Islands",
            "Fiji",
            "Finland",
            "France",
            "Gabon",
            "Gambia",
            "Georgia",
            "Germany",
            "Ghana",
            "Greece",
            "Greenland",
            "Grenada",
            "Guatemala",
            "Guinea",
            "Guinea-Bissau",
            "Guyana",
            "Haiti",
            "Honduras",
            "Iceland",
            "India",
            "Indonesia",
            "Iran",
            "Iraq",
            "Ireland",
            "Israel",
            "Italy",
            "Jamaica",
            "Japan",
            "Jordan",
            "Kazakhstan",
            "Kenya",
            "Kiribati",
            "Kosovo",
            "Kuwait",
            "Kyrgyzstan",
            "Laos",
            "Latvia",
            "Lebanon",
            "Lesotho",
            "Liberia",
            "Libya",
            "Liechtenstein",
            "Lithuania",
            "Luxembourg",
            "Malawi",
            "Malaysia",
            "Maldives",
            "Mali",
            "Malta",
            "Mauritania",
            "Mauritius",
            "Mexico",
            "Micronesia (country)",
            "Moldova",
            "Monaco",
            "Mongolia",
            "Montenegro",
            "Morocco",
            "Mozambique",
            "Myanmar",
            "Namibia",
            "Nauru",
            "Nepal",
            "Netherlands",
            "New Zealand",
            "Nicaragua",
            "Niger",
            "Nigeria",
            "North Macedonia",
            "Norway",
            "Oman",
            "Pakistan",
            "Palestine",
            "Panama",
            "Papua New Guinea",
            "Paraguay",
            "Peru",
            "Philippines",
            "Poland",
            "Portugal",
            "Qatar",
            "Romania",
            "Russia",
            "Rwanda",
            "Saint Kitts and Nevis",
            "Saint Lucia",
            "Saint Vincent and the Grenadines",
            "Samoa",
            "San Marino",
            "Sao Tome and Principe",
            "Saudi Arabia",
            "Senegal",
            "Serbia",
            "Seychelles",
            "Sierra Leone",
            "Singapore",
            "Slovakia",
            "Slovenia",
            "Solomon Islands",
            "Somalia",
            "South Africa",
            "South Korea",
            "South Sudan",
            "Spain",
            "Sri Lanka",
            "Sudan",
            "Suriname",
            "Sweden",
            "Switzerland",
            "Syria",
            "Taiwan",
            "Tajikistan",
            "Tanzania",
            "Thailand",
            "Timor",
            "Togo",
            "Tonga",
            "Trinidad and Tobago",
            "Tunisia",
            "Turkey",
            "Turkmenistan",
            "Tuvalu",
            "Uganda",
            "Ukraine",
            "United Arab Emirates",
            "United Kingdom",
            "United States",
            "Uruguay",
            "Uzbekistan",
            "Vanuatu",
            "Vatican",
            "Venezuela",
            "Vietnam",
            "Yemen",
            "Zambia",
            "Zimbabwe"
          ]
        },
        ExpandCollapse: {
          Type: "ExpandAllValues",
          Values: []
        },
        Order: {
          Type: "None",
          Values: []
        },
        ValuesStyles: []
      }
    ],
    Data: [
      {
        Name: "Element1",
        Title: "Population with age < 65",
        DataField: "F2",
        Aggregation: "",
        DataType: "real",
        Visible: "Yes",
        Picture: "ZZZZZZZZZZZZZZ9",
        RaiseItemClick: true,
        IsComponent: false,
        TargetValue: 100,
        MaximumValue: 100,
        Style: "",
        ConditionalStyles: [],
        IsFormula: true,
        Formula: "(F2_1*(100-F2_2))/100"
      },
      {
        Name: "Element5",
        Title: "Population with age >= 65",
        DataField: "F3",
        Aggregation: "",
        DataType: "real",
        Visible: "Yes",
        Picture: "ZZZZZZZZZZZZZZ9",
        RaiseItemClick: true,
        IsComponent: false,
        TargetValue: 100,
        MaximumValue: 100,
        Style: "",
        ConditionalStyles: [],
        IsFormula: true,
        Formula: "(F3_1*F3_2)/100"
      },
      {
        Name: "F2_1",
        Title: "F2_1",
        DataField: "F2_1",
        Aggregation: "",
        DataType: "integer",
        Visible: "Never",
        Picture: "ZZZZZZZZZZZZZZ9",
        RaiseItemClick: true,
        IsComponent: true,
        TargetValue: 100,
        MaximumValue: 100,
        Style: "",
        ConditionalStyles: [],
        IsFormula: false,
        Formula: ""
      },
      {
        Name: "F2_2",
        Title: "F2_2",
        DataField: "F2_2",
        Aggregation: "",
        DataType: "real",
        Visible: "Never",
        Picture: "ZZZZZZZZZZZZZZ9.99",
        RaiseItemClick: true,
        IsComponent: true,
        TargetValue: 100,
        MaximumValue: 100,
        Style: "",
        ConditionalStyles: [],
        IsFormula: false,
        Formula: ""
      },
      {
        Name: "F3_1",
        Title: "F3_1",
        DataField: "F3_1",
        Aggregation: "",
        DataType: "integer",
        Visible: "Never",
        Picture: "ZZZZZZZZZZZZZZ9",
        RaiseItemClick: true,
        IsComponent: true,
        TargetValue: 100,
        MaximumValue: 100,
        Style: "",
        ConditionalStyles: [],
        IsFormula: false,
        Formula: ""
      },
      {
        Name: "F3_2",
        Title: "F3_2",
        DataField: "F3_2",
        Aggregation: "",
        DataType: "real",
        Visible: "Never",
        Picture: "ZZZZZZZZZZZZZZ9.99",
        RaiseItemClick: true,
        IsComponent: true,
        TargetValue: 100,
        MaximumValue: 100,
        Style: "",
        ConditionalStyles: [],
        IsFormula: false,
        Formula: ""
      }
    ]
  },
  Data: {
    Rows: [
      {
        F1: "China                                   ",
        F2: "1286165331.20866",
        F3: "153158442.79134",
        F2_1: "1439323774",
        F2_2: "10.641",
        F3_1: "1439323774",
        F3_2: "10.641"
      },
      {
        F1: "India                                   ",
        F2: "1297355922.38235",
        F3: "82648462.61765",
        F2_1: "1380004385",
        F2_2: "5.989",
        F3_1: "1380004385",
        F3_2: "5.989"
      },
      {
        F1: "United States                           ",
        F2: "279985209.01789",
        F3: "51017437.98211",
        F2_1: "331002647",
        F2_2: "15.413",
        F3_1: "331002647",
        F3_2: "15.413"
      },
      {
        F1: "Indonesia                               ",
        F2: "258974899.59901",
        F3: "14548721.40099",
        F2_1: "273523621",
        F2_2: "5.319",
        F3_1: "273523621",
        F3_2: "5.319"
      },
      {
        F1: "Pakistan                                ",
        F2: "210963220.72155",
        F3: "9929110.27845",
        F2_1: "220892331",
        F2_2: "4.495",
        F3_1: "220892331",
        F3_2: "4.495"
      },
      {
        F1: "Brazil                                  ",
        F2: "194381328.34232",
        F3: "18178080.65768",
        F2_1: "212559409",
        F2_2: "8.552",
        F3_1: "212559409",
        F3_2: "8.552"
      },
      {
        F1: "Nigeria                                 ",
        F2: "200468686.96163",
        F3: "5670900.03837",
        F2_1: "206139587",
        F2_2: "2.751",
        F3_1: "206139587",
        F3_2: "2.751"
      },
      {
        F1: "Bangladesh                              ",
        F2: "156293518.25466",
        F3: "8395864.74534",
        F2_1: "164689383",
        F2_2: "5.098",
        F3_1: "164689383",
        F3_2: "5.098"
      },
      {
        F1: "Russia                                  ",
        F2: "125243872.2612",
        F3: "20690587.7388",
        F2_1: "145934460",
        F2_2: "14.178",
        F3_1: "145934460",
        F3_2: "14.178"
      },
      {
        F1: "Mexico                                  ",
        F2: "120091834.12679",
        F3: "8840918.87321",
        F2_1: "128932753",
        F2_2: "6.857",
        F3_1: "128932753",
        F3_2: "6.857"
      }
    ]
  }
};

const meta: Meta<{
  type: string,
  serviceResponse: any,
  chartType?: string,
  trendPeriod?: string,
  orientation?: string
}> = {
  component: "gx-query-viewer",
  argTypes: {
    orientation: {
      options: ["Vertical", "Horizontal"],
      control: {
        type: 'select'
      },
      defaultValue: "Vertical"
    },
    chartType: {
      options: ["Column", "Column3D"],
      control: {
        type: 'select'
      },
      defaultValue: "Column"
    },
    trendPeriod: {
      options: [
        "SinceTheBeginning",
        "LastYear",
        "LastSemester",
        "LastQuarter",
        "LastMonth",
        "LastWeek",
        "LastDay",
        "LastHour",
        "LastMinute",
        "LastSecond"
      ],
      control: {
        type: 'select'
      },
    }
  },
  args: {
    serviceResponse: serviceResponseCardMock,
  }
};
export default meta;

type ChartStory = StoryObj<{
  type: "Chart",
  allowSelection: false,
  cssClass: string,
  chartType: string,
  plotSeries: string,
  queryTitle: string,
  serviceResponse: any
  showDataLabelsIn: string,
  showValues: boolean,
  xAxisIntersectionAtZero: boolean,
  xAxisLabels: string,
  xAxisTitle: string,
  yAxisTitle: string,
}>;

type CardStory = StoryObj<{
  type: "Card",
  includeMaxMin: boolean;
  includeSparkline: boolean;
  includeTrend: boolean;
  orientation: string,
  serviceResponse: any
  showDataAs: string;
  trendPeriod: string;
}>;

export const Card: CardStory = {
  args: {
    type: "Card",
    includeSparkline: true,
    includeTrend: true,
    includeMaxMin: true,
    trendPeriod: "SinceTheBeginning",
    showDataAs: "Values",
    orientation: "Vertical",
  },
  parameters: {
    controls: { exclude: ['chartType'] }
  }
};

export const Chart: ChartStory = {
  name: "Chart with column",
  args: {
    type: "Chart",
    chartType: "Column",
    allowSelection: false,
    plotSeries: "InTheSameChart",
    showDataLabelsIn: "Columns",
    queryTitle: "Single data chart",
    xAxisIntersectionAtZero: false,
    xAxisLabels: "",
    xAxisTitle: "",
    yAxisTitle: "",
    serviceResponse: serviceResponseChartMock,
  },
  parameters: {
    controls: { exclude: ['orientation', 'trendPeriod'] }
  }
};


export const Chart3D: ChartStory = {
  name: "Chart with column 3D",
  args: {
    type: "Chart",
    chartType: "Column3D",
    allowSelection: false,
    plotSeries: "InTheSameChart",
    showDataLabelsIn: "Columns",
    queryTitle: "Single data chart",
    xAxisIntersectionAtZero: false,
    xAxisLabels: "",
    xAxisTitle: "",
    yAxisTitle: "",
    serviceResponse: serviceResponseChartMock,
  },
  parameters: {
    controls: { exclude: ['orientation', 'trendPeriod'] }
  }
};
