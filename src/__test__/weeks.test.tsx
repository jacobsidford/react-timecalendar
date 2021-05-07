import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { expect } from 'chai';
import Week from '../Weeks';
import Day from '../Day';

describe('Weeks', () => {
	const mockOnDateClick = jest.fn();
	const mockDate = new Date('2020-10-05T12:00:00.000Z');
	const mockSelectedTime = { start: mockDate.toString(), end: mockDate.toString() };

	it('should have 5 rows when a months days are spread over 5 weeks', () => {
		const mockWeek = shallow(
			<Week selectedDate={mockDate} onDateClick={mockOnDateClick} selectedTime={mockSelectedTime} />
		);
		expect(mockWeek.find('.row')).to.have.lengthOf(5);
	});

	it('should have 6 rows when a months days are spread over 6 weeks', () => {
		const mockDate = new Date('2020-05-05T12:00:00.000Z');
		const mockWeek = shallow(
			<Week selectedDate={mockDate} onDateClick={mockOnDateClick} selectedTime={mockSelectedTime} />
		);
		expect(mockWeek.find('.row')).to.have.lengthOf(6);
	});

  // todo: export row to separate file
	it('should have 7 days per row', () => {
		const mockWeek = shallow(
			<Week selectedDate={mockDate} onDateClick={mockOnDateClick} selectedTime={mockSelectedTime} />
		);
			mockWeek.find('.row').forEach((node) => {
				expect(node.find(Day)).to.have.lengthOf(7);
			})
	});
});
