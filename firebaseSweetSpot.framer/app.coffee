# ----------- METADATA ----------- #
Framer.info =
	title: "Sweet Spot Diabetes Calculator App"
	author: "Ed Monterrubio"
	date: "03/6/2018"
	description: "Diabetes Type 1 Insulin Calculator"
# ----------- SETTINGS ----------- #
InputModule = require "input-framer/input"
{Firebase} = require 'firebase'
{Picker} = require 'picker'
# ----------- FIREBASE ----------- #
sweetSpot = new Firebase
	projectID: "sweetspot-738f3"
	secret: "vI0OkwEHsSAVVHsSWBMGQbW0krKJhfzNjC0NGcS7"
	server: "s-usc1c-nss-110.firebaseio.com"
# ----------- COLORS ----------- #
blue = "#007AFF"
gray = "#999999"
red = "#D0021B"
green = "#69C800"
orange = "#FFB200"
# ----------- GLOBAL VARIABLES ----------- #
# FORMULA VARIABLES
insulinCarb = 0
insulinCorrection = 0
insulinPerHr = 0
timeElapse = 0
timeLeft = 0
timePrev = 0
timeCurrent = 0
insulinOnBoard = 0
insulinTotal = 0

# INPUT VARIABLES
bgReading = 0
carbAmount = 0

# DISPLAY VARIABLES
totalBolus = 0
correctionBolus = 0
carbsBolus = 0
iob = 0
lastBolusAmount = 9
timeLastBolus = 1524842891169
# ----------- CALCULATION FORMULAS ----------- #
# insulinCarb = carbAmount / carbFactor
# insulinCorrection = (bgReading - bgTarget) / sensitivityFactor
# insulinPerHr = lastBolusAmount / 3
# timeElapse = timeCurrent - timeLastBolus
# timeLeft = 3 - timeElapse
# insulinOnBoard = insulinPerHr * timeLeft
# insulinTotal = (insulinCarb + insulinCorrection) - insulinOnBoard

# ----------- CURRENT TIME / DATE ----------- #
today = new Date
weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
currentTime = today.getTime()
day = today.getDate()
year = today.getFullYear()
hours = today.getHours()
minutes = today.getMinutes()
dayOfWeek = weekday[today.getDay()]
month = months[today.getMonth()]
ender =
if day == 1 or day == 21 or day == 31 then ender = 'st'
else if day == 2 or day == 22 then ender = 'nd'
else if day == 3 or day == 23 then ender = 'rd'
else ender = 'th'

ampm = if hours >= 12 then 'pm' else 'am'
hours = hours % 12
hours = if hours then hours else 12
# the hour '0' should be '12'
minutes = if minutes < 10 then '0' + minutes else minutes
strTime = hours + ':' + minutes + ' ' + ampm
strDate = month + ' ' + day + ender + ', ' + year
strFullDate = dayOfWeek + ', ' + strDate + ' ' + strTime

# print currentTime

# time = new Date().getTime()
# date = new Date(time)
# print (date.toString());

# ms = Math.round(new Date().getTime()/1000.0)
# print ms
# ----------- MEAL TIME DRUM ARRAY ----------- #
drumContent = [
	{
		options: ["Wake Up", "Breakfast", "After Breakfast", "Lunch", "After Lunch", "Dinner", "After Dinner", "Bedtime", "Middle of the Night", "Snack"]
		width: Screen.width
		textAlign: "center"
	}
]
# ----------- TIME BLOCKS LOGIC ----------- #
to24HrTime = (time) ->
	timeArray = time.split(/[: ]+/)
	newVar = timeArray[0] + timeArray[1] # <- "833" as a string
	varAsNum = parseInt(newVar); # <- 833 as a number
	if timeArray[3] == "pm"
		varAsNum + 1200
	return varAsNum
	
strTime24Hr = to24HrTime(strTime)

# MORNING TIME BLOCK
if strTime24Hr > 0 and strTime24Hr < 559
	carbFactor = 10
	sensitivityFactor = 50
	bgTarget = 140
# 	print "morning"
	
# DAYTIME BLOCK
else if strTime24Hr >= 600 and strTime24Hr < 1959
	carbFactor = 8
	sensitivityFactor = 45
	bgTarget = 100
# 	print "Daytime"
	
# NIGHT TIME BLOCK
else if strTime24Hr >= 2000 and strTime24Hr < 2359
	carbFactor = 10
	sensitivityFactor = 50
	bgTarget = 140
# 	print "night"
	
else 
	print "None applied"
	
# splits the time at the colon and the space between the minutes and the am/pm
# print strTime.split(/[: ]+/)
# 
# ----------- BLOOD GLUCOSE RANGE LOGIC ----------- #
bloodGlucoseRangeFunc = (number) ->
	if number <= 75
		bgSummaryColorTag.backgroundColor = red
		bgSummaryResult.color = red
# 		print number + " is critical low"
	else if number >= 76 and number <= 85
		bgSummaryColorTag.backgroundColor = red
		bgSummaryResult.color = red
# 		print number + " is low"
	else if number >= 86 and number <= 140
		bgSummaryColorTag.backgroundColor = green
		bgSummaryResult.color = green
# 		print number + " is perfect"
	else if number >= 141 and number <= 199
		bgSummaryColorTag.backgroundColor = green
		bgSummaryResult.color = green
# 		print number + " is above perfect"
	else if number >= 200 and number <= 299
		bgSummaryColorTag.backgroundColor = orange
		bgSummaryResult.color = orange
# 		print number + " is high"
	else
		bgSummaryColorTag.backgroundColor = orange
		bgSummaryResult.color = orange
# 		print number + " is critical high"
	
# ----------- CONTAINERS ----------- #
# NEW ENTRY SCREEN
newEntryContainer = new Layer
	size: Screen.size
	backgroundColor: "white"

# CALCULATION RESULT SCREEN
calculationContainer = new Layer
	size: Screen.size
	backgroundColor: "#F2F4F7"
	
resultsCard = new Layer
	parent: calculationContainer
	width: Screen.width, height: 240, y: 54
	backgroundColor: "white"
	shadow1: {y:1, blur: 1}
	
summaryCard = new Layer
	parent: calculationContainer
	width: Screen.width, height: 190, y: 54 + resultsCard.height + 5
	backgroundColor: "white"
	shadow1: {y:1, blur: 1}
	
notesCard = new Layer
	parent: calculationContainer
	width: Screen.width, height: 55, y: 54 + resultsCard.height + summaryCard.height + 10
	backgroundColor: "white"
	shadow1: {y:1, blur: 1}
	
# SCREEN FLOW
flow = new FlowComponent
flow.showNext(newEntryContainer)
# flow.showNext(calculationContainer)

# ----------- WHEEL PICKER ----------- #
multiPicker = new Picker
	parent: newEntryContainer
	drums: drumContent
multiPicker.stateSwitch "hidden"

# ----------- NAV BAR ----------- #
navBar = new Layer
	width: Screen.width, height: 54
	backgroundColor: "white"

realClock = new TextLayer
	parent: navBar
	width: Screen.width, height: 30, y: 5, x: Screen.width/2.3
	backgroundColor: null
	text: strTime
	color: "black"
	font: "400 14px/1 -apple-system, Helvetica Neue"

actionBtn = new TextLayer
	parent: navBar
	x: 20, y: 30
	text: "Cancel"
	color: blue
	font: "400 16px/1 -apple-system, Helvetica Neue"
	
navBarHeader = new TextLayer
	parent: navBar
	x: Align.center, y: 30
	text: "New Entry"
	color: "black"
	font: "500 16px/1 -apple-system, Helvetica Neue"

# ----------- NEW ENTRY SCREEN ----------- #
mealTimeLabel = new TextLayer
	parent: newEntryContainer
	width: Screen.width - 45, height: 25, x: 25, y: navBar.height + 15
	backgroundColor: null
	text: "Meal Time"
	color: "black"
	font: "400 16px/.5 -apple-system, Helvetica Neue"
	shadow1: {y:1}
	
mealTimeSelection = new TextLayer
	parent: newEntryContainer
	width: Screen.width - 45, height: 25, x: 25, y: navBar.height + mealTimeLabel.height + 40
	backgroundColor: null
	text: multiPicker.drum0.value
	color: "black"
	font: "400 16px/.1 -apple-system, Helvetica Neue"
	padding: {left:10}
	shadow1: {y:1}
	
arrow = new SVGLayer
	parent: newEntryContainer
	width: 10, height: 17, y: 112, x: Screen.width - 40
	svg: """<svg width="10px" height="17px" viewBox="0 0 10 17" version="1.1">
	<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
		<g id="noun_1249169_cc" transform="translate(-28.000000, 0.000000)" fill="#000000" fill-rule="nonzero">
			<path d="M29.8379779,0.596169291 C29.4329945,0.205023274 28.7892532,0.210617212 28.3911284,0.608742023 C27.9930036,1.00686683 27.9874096,1.65060817 28.3785557,2.05559153 L34.6146442,8.29374428 L28.3785557,14.531897 C28.1102484,14.7910368 28.0026434,15.1747838 28.0970986,15.5356444 C28.1915538,15.8965051 28.4733699,16.1783211 28.8342305,16.2727763 C29.1950912,16.3672315 29.5788381,16.2596265 29.8379779,15.9913193 L36.8048096,9.02448752 C37.2077319,8.62144355 37.2077319,7.96810925 36.8048096,7.56506528 L29.8379779,0.596169291 Z" id="Shape"></path>
		</g>
	</g>
</svg>"""
	
bloodGlucoseLabel = new TextLayer
	parent: newEntryContainer
	width: Screen.width - 45, height: 20, x: 25, y: navBar.height + mealTimeLabel.height + mealTimeSelection.height + 60
	backgroundColor: null
	text: "Blood Glucose (mg/dl)"
	color: "black"
	font: "400 16px/.5 -apple-system, Helvetica Neue"

bloodGlucoseInput = new InputModule.Input
	parent: newEntryContainer
	setup: false
	width: Screen.width - 45, height: 40, x: 25
	y: navBar.height + mealTimeLabel.height + mealTimeSelection.height + 85
	placeholder: "0"
	placeholderColor: "#ccc"
	fontFamily: "-apple-system, Helvetica Neue"
	fontSize: 30
	fontWeight: "400"
	lineHeight: 1
	padding: "0 0 0 0"
	virtualKeyboard: false
	shadow1: {y:1}

carbsLabel = new TextLayer
	parent: newEntryContainer
	width: Screen.width - 45, height: 20, x: 25, y: navBar.height + mealTimeLabel.height + mealTimeSelection.height + bloodGlucoseLabel.height + bloodGlucoseInput.height + 90
	backgroundColor: null
	text: "Carbs (g)"
	color: "black"
	font: "400 14px/.5 -apple-system, Helvetica Neue"
	
carbsInput = new InputModule.Input
	parent: newEntryContainer
	setup: false
	width: Screen.width - 45, height: 40, x: 25
	y: navBar.height + mealTimeLabel.height + mealTimeSelection.height + bloodGlucoseLabel.height + bloodGlucoseInput.height + carbsLabel.height + 95
	placeholder: "0"
	placeholderColor: "#ccc"
	fontFamily: "-apple-system, Helvetica Neue"
	fontSize: 30
	fontWeight: "400"
	lineHeight: 1
	padding: "0 0 0 0"
	virtualKeyboard: false
	shadow1: {y:1}

calculateButton = new Layer
	parent: newEntryContainer
	width: 340, height: 40, x: Align.center
	y: navBar.height + mealTimeLabel.height + mealTimeSelection.height + bloodGlucoseLabel.height + bloodGlucoseInput.height + carbsLabel.height + 160
	backgroundColor: blue
	borderRadius: 4
	html: "Calculate"
	shadowSpread: 1
	shadowY: 1
	shadowColor: "rgba(0,0,0,0.2)"
calculateButton.style =
	fontSize: "18px"
	fontWeight: 500
	textAlign: "center"
	lineHeight: 2.2
	
saveButton = new Layer
	parent: calculationContainer
	width: 340, height: 40, x: Align.center
	y: Screen.height - 80
	backgroundColor: blue
	borderRadius: 4
	html: "Save"
	shadowSpread: 1
	shadowY: 1
	shadowColor: "rgba(0,0,0,0.2)"
saveButton.style =
	fontSize: "18px"
	fontWeight: 500
	textAlign: "center"
	lineHeight: 2.2

# ----------- CALCULATION RESULTS SCREEN ----------- #

# RESULTS CARD
todayDate = new TextLayer
	parent: resultsCard
	width: Screen.width - 45, height: 20, x: 25, y: 15
	backgroundColor: null
	text: "Today"
	color: "black"
	font: "400 18px/1 -apple-system, Helvetica Neue"

todayTime = new TextLayer
	parent: resultsCard
	width: Screen.width - 45, height: 20, x: todayDate.width - 30, y: 15
	backgroundColor: null
	text: strTime
	color: "#666"
	font: "400 16px/1.2 -apple-system, Helvetica Neue"
	
totalBolusLabel = new TextLayer
	parent: resultsCard
	width: Screen.width/2, height: 20, x: 25, y: todayDate.height + 30
	text: "Total Bolus"
	color: "black"
	font: "400 16px/1 -apple-system, Helvetica Neue"
	
totalBolusResult = new TextLayer
	parent: resultsCard
	width: Screen.width - 45, height: 40, x: 25
	y: todayDate.height + totalBolusLabel.height + 40
	text: ""
	color: "black"
	font: "400 36px/1 -apple-system, Helvetica Neue"
	shadow1: {y:1}
	
totalBolusInput = new InputModule.Input
	parent: resultsCard
	setup: false
	width: Screen.width - 45, height: 40, x: 25
	y: todayDate.height + totalBolusLabel.height + 40
	fontFamily: "-apple-system, Helvetica Neue"
	fontSize: 30
	fontWeight: "400"
	lineHeight: 1
	padding: "0 0 0 0"
	virtualKeyboard: false
	shadow1: {y:1}
	visible: false
	
updateBtn = new Layer
	parent: resultsCard
	width: 60, height: 30, x: Screen.width / 1.25
	y: todayDate.height + totalBolusLabel.height + 25
	backgroundColor: gray
	borderRadius: 4
	html: "Update"
	shadowSpread: 1
	shadowY: 1
	shadowColor: "rgba(0,0,0,0.2)"
	visible: false
updateBtn.style =
	fontSize: "14px"
	fontWeight: 400
	textAlign: "center"
	lineHeight: 2.2
	
# CALCULATIONS
# CONVERTS MILLISECONDS TO MINUTES OR HOURS
timeConversion = (duration) ->
	milliseconds = (duration % 1000)
	seconds = (duration / 1000) % 60
	minutes = (duration / (60 * 1000)) % 60
	hours = (duration / (1000 * 60 * 60)) % 24
	return Math.round((hours * 10)/10) + " hrs and " + Math.round((minutes * 10)/10) + " minutes"
	
# CONVERTS MILLISECONDS TO MINUTES OR HOURS
decConversion = (duration) ->
	milliseconds = (duration % 1000)
	seconds = (duration / 1000) % 60
	minutes = (duration / (60 * 1000)) % 60
	hours = (duration / (1000 * 60 * 60)) % 24
	#parseFloat converts a string ('1.25') into a number (1.25)
	return parseFloat(hours + "." + minutes)
	
# FORMATS TIME IN MILLISECONDS TO LOCAL TIME
msToTime = (milli) ->
	time = new Date(milli)
	hours = time.getHours()
	minutes = time.getMinutes()
	seconds = time.getSeconds()
	milliseconds = time.getMilliseconds()
	ampm = if hours >= 12 then 'pm' else 'am'
	hours = hours % 12
	hours = if hours then hours else 12
	# the hour '0' should be '12'
	minutes = if minutes < 10 then '0' + minutes else minutes
	return hours + ":" + minutes + " " + ampm

# CALCULATE AMOUNT OF INSULINE TO COVER CARBS
insulinCarbFunc = ->
	carbAmount = carbsInput.value
	insulinCarb = carbAmount / carbFactor
# 	print "Insulin Carb: " + insulinCarb
	return insulinCarb
	
# CALCULATE AMOUNT OF INSULIN TO BRING BG DOWN TO TARGET RANGE
insulinCorrectionFunc = ->
	bgReading = bloodGlucoseInput.value
	insulinCorrection = (bgReading - bgTarget) / sensitivityFactor
# 	print "Insulin Correction: " + insulinCorrection.toFixed(1) + "(u)"
	return insulinCorrection

# print "The current time is: " + strTime
# print "Last Bolus was taken at: " + msToTime(timeLastBolus)
	
# CALCULATE AMOUNT OF INSULIN STILL WORKING IN THE BODY
insulinOnBoardFunc = ->
	insulinPerHr = lastBolusAmount / 3
	# how much time has passed since the last dose of insulin was taken
	timeElapse = currentTime - timeLastBolus
	# (3 hrs - timeElapse) how much time is left before active insulin in body is complete
	timeLeft = 1.08e+7 - timeElapse
	insulinOnBoard = insulinPerHr * decConversion(timeLeft)
# 	print "Insulin per Hour: " + insulinPerHr + "(u)"
# 	print "Time elapsed since last injection: " + timeConversion(timeElapse)
# 	print "Remaining time of IOB: " + timeConversion(timeLeft)	
# 	print "Remaining amount of IOB: " + insulinOnBoard.toFixed(1) + "(u)"
	return insulinOnBoard
	
# CALCULATE TOTAL AMOUNT OF INSULIN TO TAKE
insulinTotalFunc = ->
	insulinTotal = (insulinCarb + insulinCorrection) - insulinOnBoard
# 	print "Insulin Total: " + insulinTotal.toFixed(1)
	return insulinTotal
	
correctionBolusLabel = new TextLayer
	parent: resultsCard
	width: Screen.width/2, height: 20, x: 25, 
	y: todayDate.height + totalBolusLabel.height + totalBolusResult.height + totalBolusInput.height + 20
	text: "Correction Bolus"
	color: "black"
	font: "400 16px/1 -apple-system, Helvetica Neue"
	
correctionBolusResult = new TextLayer
	parent: resultsCard
	width: 100, height: 20, x: correctionBolusLabel.width * 1.4, 
	y: todayDate.height + totalBolusLabel.height + totalBolusResult.height + totalBolusInput.height + 20
	text: ""
	textAlign: "right"
	color: "black"
	font: "600 16px/1 -apple-system, Helvetica Neue"
	
carbsBolusLabel = new TextLayer
	parent: resultsCard
	width: Screen.width/2, height: 20, x: 25, 
	y: todayDate.height + totalBolusLabel.height + totalBolusResult.height + totalBolusInput.height + correctionBolusLabel.height + 30
	text: "Carbs Bolus"
	color: "black"
	font: "400 16px/1 -apple-system, Helvetica Neue"
	
carbsBolusResult = new TextLayer
	parent: resultsCard
	width: 100, height: 20, x: correctionBolusLabel.width * 1.4, 
	y: todayDate.height + totalBolusLabel.height + totalBolusResult.height + totalBolusInput.height + correctionBolusLabel.height + 30
	text: ""
	textAlign: "right"
	color: "black"
	font: "600 16px/1 -apple-system, Helvetica Neue"
	
IOBLabel = new TextLayer
	parent: resultsCard
	width: Screen.width/2, height: 20, x: 25, 
	y: todayDate.height + totalBolusLabel.height + totalBolusResult.height + totalBolusInput.height + correctionBolusLabel.height + carbsBolusLabel.height + 40
	text: "IOB"
	color: "black"
	font: "400 16px/1 -apple-system, Helvetica Neue"
	
IOBResult = new TextLayer
	parent: resultsCard
	width: 100, height: 20, x: correctionBolusLabel.width * 1.4, 
	y: todayDate.height + totalBolusLabel.height + totalBolusResult.height + totalBolusInput.height + correctionBolusLabel.height + carbsBolusLabel.height + 40
	text: ""
	textAlign: "right"
	color: "black"
	font: "600 16px/1 -apple-system, Helvetica Neue"
	
# SUMMARY CARD
mealTimeLabel = new TextLayer
	parent: summaryCard
	width: Screen.width/2, height: 20, x: 25, y: 25
	text: "Meal Time"
	color: "black"
	font: "400 16px/1 -apple-system, Helvetica Neue"
	
mealTimeValue = new TextLayer
	parent: summaryCard
	width: 200, height: 20, x: mealTimeLabel.width - 18, y: 25
	text: multiPicker.drum0.value
	textAlign: "right"
	color: "black"
	font: "600 16px/1 -apple-system, Helvetica Neue"
	
bgSummaryColorTag = new Layer
	parent: summaryCard
	width: 4, height: 25, y: mealTimeLabel.height + 30
	backgroundColor: null
	
bgSummaryLabel = new TextLayer
	parent: summaryCard
	width: Screen.width/2, height: 20, x: 25, y: mealTimeLabel.height + 35
	text: "Blood Glucose"
	color: "black"
	font: "400 16px/1 -apple-system, Helvetica Neue"
	
bgSummaryResult = new TextLayer
	parent: summaryCard
	width: Screen.width/2, height: 20, x: bgSummaryLabel.width - 22
	y: mealTimeLabel.height + 35
	text: ""
	textAlign: "right"
	color: "black"
	font: "600 16px/1 -apple-system, Helvetica Neue"
	
carbsResultLabel = new TextLayer
	parent: summaryCard
	width: Screen.width/2, height: 20, x: 25
	y: mealTimeLabel.height + bloodGlucoseLabel.height + 45
	text: "Carbs"
	color: "black"
	font: "400 16px/1 -apple-system, Helvetica Neue"
	
carbsResult = new TextLayer
	parent: summaryCard
	width: Screen.width/2, height: 20, x: bgSummaryLabel.width - 22
	y: mealTimeLabel.height + bloodGlucoseLabel.height + 45
	text: ""
	textAlign: "right"
	color: "black"
	font: "600 16px/1 -apple-system, Helvetica Neue"
	
lastInsulinAmountLabel = new TextLayer
	parent: summaryCard
	width: Screen.width/2, height: 20, x: 25
	y: mealTimeLabel.height + bloodGlucoseLabel.height + carbsResultLabel.height + 55
	text: "Last Insulin Amount"
	color: "black"
	font: "400 16px/1 -apple-system, Helvetica Neue"
	
lastInsulinAmountResult = new TextLayer
	parent: summaryCard
	width: Screen.width/2, height: 20, x: bgSummaryLabel.width - 22, y: mealTimeLabel.height + bloodGlucoseLabel.height + lastInsulinAmountLabel.height + 55
	text: "5 u"
	textAlign: "right"
	color: "black"
	font: "600 16px/1 -apple-system, Helvetica Neue"
	
hrsSinceLastInjectionLabel = new TextLayer
	parent: summaryCard
	width: Screen.width/2, height: 20, x: 25, y: mealTimeLabel.height + bloodGlucoseLabel.height + carbsResultLabel.height + lastInsulinAmountLabel.height + 65
	text: "Hours since last injection"
	color: "black"
	font: "400 16px/1 -apple-system, Helvetica Neue"
	
hrsSinceLastInjectionResult = new TextLayer
	parent: summaryCard
	width: Screen.width/2, height: 20, x: bgSummaryLabel.width - 22, y: mealTimeLabel.height + bloodGlucoseLabel.height + lastInsulinAmountLabel.height + hrsSinceLastInjectionLabel.height + 65
	text: ""
	textAlign: "right"
	color: "black"
	font: "600 16px/1 -apple-system, Helvetica Neue"
	
notesLabel = new TextLayer
	parent: notesCard
	width: Screen.width/2, height: 20, x: 25, y: 20
	text: "Notes"
	color: "black"
	font: "400 16px/1 -apple-system, Helvetica Neue"
	
arrow = new SVGLayer
	parent: notesCard
	width: 10, height: 17, y: Align.center, x: Screen.width - 30
	svg: """<svg width="10px" height="17px" viewBox="0 0 10 17" version="1.1">
	<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
		<g id="noun_1249169_cc" transform="translate(-28.000000, 0.000000)" fill="#000000" fill-rule="nonzero">
			<path d="M29.8379779,0.596169291 C29.4329945,0.205023274 28.7892532,0.210617212 28.3911284,0.608742023 C27.9930036,1.00686683 27.9874096,1.65060817 28.3785557,2.05559153 L34.6146442,8.29374428 L28.3785557,14.531897 C28.1102484,14.7910368 28.0026434,15.1747838 28.0970986,15.5356444 C28.1915538,15.8965051 28.4733699,16.1783211 28.8342305,16.2727763 C29.1950912,16.3672315 29.5788381,16.2596265 29.8379779,15.9913193 L36.8048096,9.02448752 C37.2077319,8.62144355 37.2077319,7.96810925 36.8048096,7.56506528 L29.8379779,0.596169291 Z" id="Shape"></path>
		</g>
	</g>
</svg>"""
	
# ----------- CALCULATION BUTTONS ----------- #

calculateButton.onClick ->
	insulinCarbFunc()
	insulinCorrectionFunc()
	insulinTotalFunc()
	insulinOnBoardFunc()
	bloodGlucoseRangeFunc(bgReading)
	totalBolusResult.text = insulinTotal.toFixed(1) + " u"
	correctionBolusResult.text = insulinCorrection.toFixed(1) + " u"
	carbsBolusResult.text = insulinCarb.toFixed(1) + " u"
	IOBResult.text = insulinOnBoard.toFixed(1) + " u"
	bgSummaryResult.text = bgReading + " mg/dL"
	carbsResult.text = carbAmount + " g"
	hrsSinceLastInjectionResult.text = timeConversion(timeLeft)
	navBarHeader.text = "Calculation"
	flow.showNext(calculationContainer)

totalBolusResult.onClick ->
	totalBolusResult.visible = false
	totalBolusInput.visible = true
	updateBtn.visible = true
	
totalBolusInput.onClick ->
	updateBtn.backgroundColor = blue

actionBtn.onClick ->
	flow.showPrevious()
	navBarHeader.text = "New Entry"

# Events + Firebase --------------------

# MULTI PICKER ACTIONS
mealTimeSelection.onClick ->
	multiPicker.animate "default"
	
multiPicker.on Events.TouchEnd, ->
# 	print multiPicker.drum0.value
	mealTimeSelection.text = multiPicker.drum0.value
	mealTimeValue.text = multiPicker.drum0.value
	multiPicker.animate "hidden"
	
multiPicker.onClick ->
	multiPicker.animate "hidden"
