import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Week from '../Weeks';
import Day from '../Day';
import Header from '../Header';

it('Header should render correctly for snapshot', () => {
  const mockDate = new Date('2020-10-05T12:00:00.000Z').toString(); 
    const mockHeader = shallow(
      <Header
        selectedDate={mockDate}
        nextTime={jest.fn()}
        prevTime={jest.fn()}
      />
      );
	expect(mockHeader).toMatchSnapshot();
});

it('Weeks should render correctly for snapshot', () => {
	const mockDate = new Date('2020-10-05T12:00:00.000Z');
	const mockWeek = shallow(
		<Week
			selectedDate={mockDate}
			onDateClick={() => true}
			selectedTime={{ start: mockDate.toString(), end: mockDate.toString() }}
		/>
	);
	expect(mockWeek).toMatchSnapshot();
});
