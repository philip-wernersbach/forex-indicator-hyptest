/*  This file is part of forex-indicator-hyptest.

    forex-indicator-hyptest is free software: you can redistribute it
    and/or modify it under the terms of the GNU Lesser General Public 
    License as published by the Free Software Foundation, either
    version 3 of the License, or (at your option) any later version.

    forex-indicator-hyptest is distributed in the hope that it will 
    be useful, but WITHOUT ANY WARRANTY; without even the implied
    warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
    See the GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public 
    License along with forex-indicator-hyptest.  If not,
    see <http://www.gnu.org/licenses>. */

/* forex-indicator-hyptest.js

   Part of forex-indicator-hyptest.

   Copyright (c) 2013 Philip Wernersbach. */



$(document).ready(function() {
	$('#run').click(function() {
		var hypothesis_test = new ForexIndicatorHyptest();
		var hypothesis_test_result;
		
		hypothesis_test.set_hypothesis_test_type($('#type').val());
		hypothesis_test.set_expected_price($('#exiting_at').val());
		hypothesis_test.set_stats_data($('#periods').val());
		
		hypothesis_test_result = hypothesis_test.hypothesis_test();
		
		if (hypothesis_test_result == true)
		{
			$('#answer').text("The currency pair WILL NOT reach the exiting price, you should NOT execute the trade.");
		} else if (hypothesis_test_result == false) {
			$('#answer').text("The currency pair may reach the exiting price, you should consider the trade.");
		} else {
			$('#answer').text("Please make sure that all of the inputs are filled in, and that you have inputted at least 60 periods.");
		}
		
		$('#result').show();
	});
}); 