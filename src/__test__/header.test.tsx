import React from "react";
import { shallow, mount, render } from "enzyme";
import Header from "../Header";

describe('Header', () => {
    const mockHeader = shallow(
      <Header
        selectedDate={new Date('2020-10-05T12:00:00.000Z').toString()}
        nextTime={jest.fn()}
        prevTime={jest.fn()}
      />
      );
    it("should render correctly", () => {
      expect(mockHeader).toMatchSnapshot();
    });

    it("should render correctly", () => {
        const value = mockHeader.find("span").text()
        expect(value).toEqual(new Date('2020-10-05T12:00:00.000Z').toString());
      });
})
