import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Header from '../Header';

describe('Header', () => {
	const mockDate = new Date('2020-10-05T12:00:00.000Z').toString();
	const mockHeader = shallow(
		<Header selectedDate={mockDate} nextTime={jest.fn()} prevTime={jest.fn()} />
	);

	it('should display provided date', () => {
		const value = mockHeader.find('span').text();
		expect(value).toEqual(mockDate);
	});
});
