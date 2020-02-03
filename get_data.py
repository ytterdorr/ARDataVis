import numpy as np
import pandas as pd 

def main():
  data = pd.read_csv("life_expectancy_years.csv")
  head = data.head()

  countryList = ["United States", "Mexico", "Portugal", "Germany", "Vietnam", "Gambia", "Sweden", "Australia"]
  years = ["2009", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018" ]
  columns = ["country"] + years
  selectedCountries =  data.loc[data["country"].isin(countryList), columns]
  selectedCountries.set_index("country", inplace=True)
  print selectedCountries
  # for country in countryList:
  #   print head.loc[head["country"] == country]
  selectedCountries.to_csv("life_expectancy_selection.csv")


if __name__ == "__main__":
  main()


