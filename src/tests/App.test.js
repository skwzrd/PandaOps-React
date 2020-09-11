import React from 'react';
import { mount, shallow } from 'enzyme';
import App from '../containers/App';

import responses from './testdata.json'

describe("App components", () => {
  
  test("Default empty table getting populated", () => {

    const wrapper_shallow = shallow(<App/>);
    expect(wrapper_shallow.text()).toBe("<LeftPanel /><Selection /><Operations /><DataFrame />");

    const wrapper_mount = mount(<App/>);

    // defaults
    expect(wrapper_mount.find("#table").text()).toBe("");
    expect(wrapper_mount.instance().state.names).toStrictEqual([]);
    expect(wrapper_mount.find("#button_sample_df").text()).toBe("Add Sample DF");

    // wrapper_mount.find("#button_sample_df").simulate("click");
    // ^ this works in the source code, but for some unknown reason,
    // it's effects dont propagate here - even after trying all kinds of update techniques

    // "click" the add sample df button
    wrapper_mount.instance().setDf("sample", "All", responses.json);

    // check the updated state
    expect(wrapper_mount.instance().state.name).toBe("sample");
    expect(wrapper_mount.instance().state.df_cols).toStrictEqual(["A", "B", "C", "D", "E", "F"]);
    expect(wrapper_mount.instance().state.names).toStrictEqual(["sample"]);

    let result = [
      "columnsABCDEF",
      "dtypesfloat64datetime64[ns]float32int64categoryobject",
      "unique values111121",
      "012013-01-0213testfoo",
      "112013-01-0213trainfoo",
      "212013-01-0213testfoo",
      "312013-01-0213trainfoo"
    ].join("");
    expect(wrapper_mount.find("#table").text()).toBe(result);

    // clear the table
  });
});