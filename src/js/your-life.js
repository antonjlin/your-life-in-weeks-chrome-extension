(function() {
	var yearEl = document.getElementById('year'),
		monthEl = document.getElementById('month'),
		dayEl = document.getElementById('day'),
		unitText = 'weeks',
		items = document.querySelectorAll('.chart li'),
		itemCount, COLOR = '#fafafa',
		KEY = {
			UP: 38,
			DOWN: 40
		};
	yearEl.addEventListener('input', _handleDateChange);
	yearEl.addEventListener('keydown', _handleUpdown);
	yearEl.addEventListener('blur', _unhideValidationStyles);
	monthEl.addEventListener('change', _handleDateChange);
	monthEl.addEventListener('keydown', _handleUpdown);
	dayEl.addEventListener('input', _handleDateChange);
	dayEl.addEventListener('blur', _unhideValidationStyles);
	dayEl.addEventListener('keydown', _handleUpdown);
	monthEl.selectedIndex = -1;
	_loadStoredValueOfDOB();

	function _handleUnitChange(e) {
		window.location = '' + e.currentTarget.value + '.html';
	}

	function _handleDateChange(e) {
		localStorage.setItem("DOB", JSON.stringify({
			month: monthEl.value,
			year: yearEl.value,
			day: dayEl.value
		}));
		if (_dateIsValid()) {
			itemCount = calculateElapsedTime();
			_repaintItems(itemCount);
		} else {
			_repaintItems(0);
		}
	}

	function _handleUpdown(e) {
		var newNum;
		thisKey = e.keyCode || e.which;
		if (e.target.checkValidity()) {
			if (thisKey === KEY.UP) {
				newNum = parseInt(e.target.value, 10);
				e.target.value = newNum += 1;
				_handleDateChange();
			} else if (thisKey === KEY.DOWN) {
				newNum = parseInt(e.target.value, 10);
				e.target.value = newNum -= 1;
				_handleDateChange();
			}
		}
	}

	function _unhideValidationStyles(e) {
		e.target.classList.add('touched');
	}

	function calculateElapsedTime() {
		var currentDate = new Date(),
			dateOfBirth = _getDateOfBirth(),
			diff = currentDate.getTime() - dateOfBirth.getTime(),
			elapsedTime;
		switch (unitText) {
			case 'days':
				elapsedTime = Math.round(diff / (1000 * 60 * 60 * 24));
				break;
			case 'weeks':
				elapsedTime = Math.round(diff / (1000 * 60 * 60 * 24 * 7));
				break;
			case 'months':
				elapsedTime = Math.round(diff / (1000 * 60 * 60 * 24 * 30.4375));
				break;
			case 'years':
				elapsedTime = Math.round(diff / (1000 * 60 * 60 * 24 * 365.25));
				break;
		}
		return elapsedTime || diff;
	}

	function _dateIsValid() {
		return monthEl.checkValidity() && dayEl.checkValidity() && yearEl.checkValidity();
	}

	function _getDateOfBirth() {
		return new Date(yearEl.value, monthEl.value, dayEl.value);
	}

	function _repaintItems(number) {
		for (var i = 0; i < items.length; i++) {
			if (i < number) {
				items[i].style.backgroundColor = COLOR;
			} else {
				items[i].style.backgroundColor = '';
			}
		}
	}

	function _loadStoredValueOfDOB() {
		var DOB = JSON.parse(localStorage.getItem('DOB'));
		if (!DOB) {
			return;
		}
		if (DOB.month >= 0 && DOB.month < 12) {
			monthEl.value = DOB.month
		}
		if (DOB.year) {
			yearEl.value = DOB.year
		}
		if (DOB.day > 0 && DOB.day < 32) {
			dayEl.value = DOB.day
		}
		_handleDateChange();
	}
})();