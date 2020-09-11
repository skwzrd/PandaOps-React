import React from 'react';
import { shallow } from 'enzyme';

import configs from '../configs.json';

import DataFrame from '../containers/DataFrame';

import responses from './testdata.json'

const wrapper_json = shallow(<DataFrame
  cmd = {configs.All}
  All = {configs.All}
  df_cols = {responses.json.df.columns}
  df_data = {responses.json.df.data}
  df = {null}
  dtypes = {responses.json.dtypes}
  uniques = {responses.json.uniques}
/>);


const wrapper_html = shallow(<DataFrame
  cmd = {"Stats"}
  All = {configs.All}
  df_cols = {null}
  df_data = {null}
  df = {responses.html.df}
  dtypes = {null}
  uniques = {null}
/>);


describe("Dataframe table rendering", () => {

  test("Render the table for cmd=All", () => {
    let df = wrapper_json.find('#table');
    let result = [
      "columnsABCDEF",
      "dtypesfloat64datetime64[ns]float32int64categoryobject",
      "unique values111121",
      "012013-01-0213testfoo",
      "112013-01-0213trainfoo",
      "212013-01-0213testfoo",
      "312013-01-0213trainfoo"
    ].join("");
    expect(df.text()).toBe(result);
  });


  test("Render the table for cmd=Stats", () => {
    let df = wrapper_html.find('#table');
    expect(df.text()).toBe(responses.html.df);
  });
  
});


describe("Dataframe component effects", () => {
  
    test("Show/hide button for cmd=All", () => {
      let main_display = wrapper_json.find('#main_display');
      expect(main_display.text()).toMatch(/^show\/hide metrics.+/);

      // default
      let metrics = wrapper_json.find(".col_metric");
      expect(metrics).toHaveLength(2);
      expect(metrics.at(0).text()).toBe("dtypesfloat64datetime64[ns]float32int64categoryobject");
      expect(metrics.at(1).text()).toBe("unique values111121");
      
      // click 1
      let show_hide_metrics = wrapper_json.find("#show_hide_metrics")
      show_hide_metrics.simulate("click");
      metrics = wrapper_json.find(".col_metric");
      expect(metrics).toHaveLength(0);
      
      // click 2 - back to default
      show_hide_metrics.simulate("click");
      metrics = wrapper_json.find(".col_metric");
      expect(metrics).toHaveLength(2);
    });

});
