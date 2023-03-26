function getCountdown(document) {
	let minusList = document.querySelectorAll('tbody#pre-launch-timeline-body tr td:first-child'),
		minusTextList = document.querySelectorAll('tbody#pre-launch-timeline-body tr td:nth-child(2)'),
		plusList = document.querySelectorAll('tbody#post-launch-timeline-body tr td:first-child'),
		plusTextList = document.querySelectorAll('tbody#post-launch-timeline-body tr td:nth-child(2)'),
		tMinusList = [],
		tPlusList = [];

	if (minusList.length > 0) {
		minusList.forEach((v, i) => {
			let num = v.innerText,
				txt = minusTextList[i].innerText;
				a = num.replace('- ', '').split(':'); // split it at the colons
				seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); // minutes are worth 60 seconds. Hours are worth 60 minutes.
			
				tMinusList.push(`${String(seconds).padEnd(11)}${txt}`)
		})
	} else {
		tMinusList.push("0          Liftoff");
	}

	if (plusList.length > 0) {
		plusList.forEach((v, i) => {
			let num = v.innerText,
				txt = plusTextList[i].innerText;
				a = num.split(':'); // split it at the colons
				seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); // minutes are worth 60 seconds. Hours are worth 60 minutes.
			
				tPlusList.push(`${String(seconds).padEnd(11)}${txt}`)
		})
	}

	return [tMinusList, tPlusList];
}

getCountdown.asCSV = (document) => {
	let lst = getCountdown(document),
		tMinusList = lst[0],
		tPlusList = lst[1];

	let endString = "T-Time     Event";

	if (tMinusList.length > 0) {
		tMinusList.forEach((v) => {
			endString += `\n${v}`;
		})
	} else {
		endString += "0          Liftoff";
	}

	endString += `\n\nT+Time     Event`;

	if (tPlusList.length > 0) {
		tPlusList.forEach((v) => {
			endString += `\n${v}`;
		})
	}

	return endString;
}

getCountdown.asJSON = (document) => {
	let minusList = document.querySelectorAll('tbody#pre-launch-timeline-body tr td:first-child'),
		minusTextList = document.querySelectorAll('tbody#pre-launch-timeline-body tr td:nth-child(2)'),
		plusList = document.querySelectorAll('tbody#post-launch-timeline-body tr td:first-child'),
		plusTextList = document.querySelectorAll('tbody#post-launch-timeline-body tr td:nth-child(2)'),
		tList = {};

	if (minusList.length > 0) {
		minusList.forEach((v, i) => {
			let num = v.innerText,
				txt = minusTextList[i].innerText;
				a = num.replace('- ', '').split(':'); // split it at the colons
				seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); // minutes are worth 60 seconds. Hours are worth 60 minutes.
			
				tList[-1 * seconds] = txt;
		})
	} else {
		tList[0] = "Liftoff";
	}

	if (plusList.length > 0) {
		plusList.forEach((v, i) => {
			let num = v.innerText,
				txt = plusTextList[i].innerText;
				a = num.split(':'); // split it at the colons
				seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); // minutes are worth 60 seconds. Hours are worth 60 minutes.
			
				tList[seconds] = txt;
		})
	}

	return tList;
}

getCountdown.asJSONs = (document) => {
	let minusList = document.querySelectorAll('tbody#pre-launch-timeline-body tr td:first-child'),
		minusTextList = document.querySelectorAll('tbody#pre-launch-timeline-body tr td:nth-child(2)'),
		plusList = document.querySelectorAll('tbody#post-launch-timeline-body tr td:first-child'),
		plusTextList = document.querySelectorAll('tbody#post-launch-timeline-body tr td:nth-child(2)'),
		tMinusList = {},
		tPlusList = {};

	if (minusList.length > 0) {
		minusList.forEach((v, i) => {
			let num = v.innerText,
				txt = minusTextList[i].innerText;
				a = num.replace('- ', '').split(':'); // split it at the colons
				seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); // minutes are worth 60 seconds. Hours are worth 60 minutes.
			
				tMinusList[seconds] = txt;
		})
	} else {
		tMinusList[0] = "Liftoff";
	}

	if (plusList.length > 0) {
		plusList.forEach((v, i) => {
			let num = v.innerText,
				txt = plusTextList[i].innerText;
				a = num.split(':'); // split it at the colons
				seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); // minutes are worth 60 seconds. Hours are worth 60 minutes.
			
				tPlusList[seconds] = txt;
		})
	}

	return [tMinusList, tPlusList];
}

module.exports = getCountdown;