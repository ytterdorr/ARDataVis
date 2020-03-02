import numpy as np
import pandas as pd 
import argparse
import os.path

def is_valid_file(parser, arg):
    if not os.path.isfile(arg):
        parser.error("The file %s does not exist!" % arg)
    else:
        return open(arg, 'r')  # return an open file handle

def main(input_file, output_file):
  data = pd.read_csv(input_file)
  head = data.head()

  countryList = ["Austria", "France", "Australia", "Belgium", "Canada", "Netherlands", "Italy", "Denmark", "United States", "Norway"]
  years = ["1989","1990", "1991","1992","1993","1994","1995","1996","1997","1998" ]
  # countryList = ["United States", "Mexico", "Portugal", "Germany", "Vietnam", "Gambia", "Sweden", "Australia"]
  # years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018" ]
  columns = ["country"] + years
  selectedCountries =  data.loc[data["country"].isin(countryList), columns]
  selectedCountries.set_index("country", inplace=True)
  print selectedCountries
  # for country in countryList:
  #   print head.loc[head["country"] == country]
  selectedCountries.to_csv(output_file)


if __name__ == "__main__":
  parser = argparse.ArgumentParser()
  parser.add_argument("-i", dest="input_file", help="input csv file" )
  parser.add_argument("-o", dest="output_file", help="output csv file" )
  args = parser.parse_args()
  inf = args.input_file
  ouf = args.output_file
  main(inf, ouf)







