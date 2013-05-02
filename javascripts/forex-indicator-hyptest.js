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



/* The hypothesis testing class. */

/* Constructor */
function ForexIndicatorHyptest() {
	/* User Inputs */
	this.expected_price = NaN;
	
	this.stats_data = null;
	this.hypothesis_test_type = null;
	
	/* Computed inputs */
	this.stats_mean = NaN;
	this.standard_deviation = NaN;
	
	/* Constants */
	
	/* The Z-Score for the alpha = 0.1 */
	this.Z_SCORE = 1.28;
	
	this.HYPOTHESIS_TEST_TYPE_GREATER_THAN = 1;
	this.HYPOTHESIS_TEST_TYPE_LESS_THAN = 2;
};

/* Static Constants */
ForexIndicatorHyptest.prototype.hypothesis_test_type_greater_than = function() {
	return this.HYPOTHESIS_TEST_TYPE_GREATER_THAN;
};

ForexIndicatorHyptest.prototype.hypothesis_test_type_less_than = function() {
	return this.HYPOTHESIS_TEST_TYPE_LESS_THAN;
};

ForexIndicatorHyptest.prototype.set_expected_price = function(price) {
	this.expected_price = parseFloat(price);
};

ForexIndicatorHyptest.prototype.set_stats_data = function(data) {
	var intermediate = data;
	
	intermediate.replace(/s+/g, '');
	this.stats_data = intermediate.split(',');
	
	for(var i=0; i < this.stats_data.length; i++)
		this.stats_data[i] = parseFloat(this.stats_data[i]);
	
	/* Compute the mean for our data. */
	this.stats_mean = ForexIndicatorHyptestMath.compute_mean(this.stats_data);
	
	/* Compute the standard deviation for our data. */
	this.standard_deviation = ForexIndicatorHyptestMath.compute_standard_deviation(ForexIndicatorHyptestMath.compute_variance(this.stats_mean, this.stats_data));
};

ForexIndicatorHyptest.prototype.set_hypothesis_test_type = function(type) {
	var the_type = parseInt(type);
	
	if ((the_type == this.hypothesis_test_type_less_than()) || (the_type == this.hypothesis_test_type_greater_than())) {
		this.hypothesis_test_type = the_type;
		return true;
	} else {
		return false;
	}
};

/* The function that tells us if we can run the hypothesis test
   computations or not. */
ForexIndicatorHyptest.prototype.status = function() {
	if (!(this.stats_mean && this.expected_price && this.stats_data && this.hypothesis_test_type && this.standard_deviation && this.stats_mean))
		/* Not all of our inputs are set. */
		return 1;
	else if (this.stats_data.length < 30)
		/* The CLT states that the sample must be a representative
		   sample, which can't be true if the stats data has less
		   than 30 entries. */
		return 2;
	else
		/* We're good to go! */
		return 0;
};

ForexIndicatorHyptest.prototype.hypothesis_test = function() {
	var test_statistic;
	
	/* Make sure we can run the hypothesis test. */
	if (this.status() != 0)
		return NaN;
	
	/* Run the formula for the test statistic. */
	test_statistic = (this.stats_mean - this.expected_price)/(this.standard_deviation/Math.sqrt(this.stats_data.length));
	
	/* H-not = Price will reach the exiting price.
	   Decide whether we can reject H-not. If we can, then the market will not reach
	   our exit price. */
	if (this.hypothesis_test_type == this.hypothesis_test_type_greater_than()) {
		if (test_statistic < -this.Z_SCORE) {
			return true;
		}
	} else {
		if (test_statistic > this.Z_SCORE) {
			return true;
		}
	}
	
	return false;
};



/* A class for purely math functions. This could be reused somewhere. */
function ForexIndicatorHyptestMathClass() {};

/* Mean = (Sum of datums)/(Number of datums) */
ForexIndicatorHyptestMathClass.prototype.compute_mean = function(data) {
	var sum = 0;
	
	for (var i = 0; i < data.length; i++)
		sum += data[i];
	
	return sum/data.length;
};

/* Standard Deviation = Square Root of Variance */
ForexIndicatorHyptestMathClass.prototype.compute_standard_deviation = function(variance) {
	return Math.sqrt(variance);
};

/* Variance = (Sum of (squares of (datum differences from mean)))/(Number of datums) */
ForexIndicatorHyptestMathClass.prototype.compute_variance = function(mean, data) {
	var difference_from_mean_squared = 0;
	
	for (var i = 0; i < data.length; i++)
		difference_from_mean_squared += Math.pow(data[i] - mean, 2);
		
	return difference_from_mean_squared/data.length;
};

/* ForexIndicatorHyptestMath is a static class. */
var ForexIndicatorHyptestMath = new ForexIndicatorHyptestMathClass();
