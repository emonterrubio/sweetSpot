InputModule = require "input-framer/input"
{Firebase} = require 'firebase'
{Picker} = require 'picker'

# ----------- FIREBASE ----------- #
sweetSpot = new Firebase
	projectID: "sweetspot-738f3"
	secret: "vI0OkwEHsSAVVHsSWBMGQbW0krKJhfzNjC0NGcS7"
	server: "s-usc1c-nss-110.firebaseio.com"

blue = "#007AFF"
gray = "#999999"

# VARIABLES
# MATH VARIABLES
insulinCarb = 0
insulinCorrection = 0
insulinPerHr = 0
timeElapse = 0
timeLeft = 0
timePrev = 0
timeCurrent = 0
insulinOnBoard = 0
insulinTotal = 0

# TIME BLOCK VARIABLES
# carbFactor = 10
# bgTarget = 100
# sensitivityFactor = 50

# INPUT VARIABLES
bgReading = 0
carbAmount = 0

# DISPLAY VARIABLES
totalBolus = 0
correctionBolus = 0
carbsBolus = 0
iob = 0
lastBolusAmount = 9
timeLastBolus = 1524409316845
# FORMULAS
# insulinCarb = carbAmount / carbFactor
# insulinCorrection = (bgReading - bgTarget) / sensitivityFactor
# insulinPerHr = lastBolusAmount / 3
# timeElapse = timeCurrent - timeLastBolus
# timeLeft = 3 - timeElapse
# insulinOnBoard = insulinPerHr * timeLeft
# insulinTotal = (insulinCarb + insulinCorrection) - insulinOnBoard

# TIME WIDGETS
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
# DRUM ARRAY
drumContent = [
	{
		options: ["Wake Up", "Breakfast", "After Breakfast", "Lunch", "After Lunch", "Dinner", "After Dinner", "Bedtime", "Middle of the Night", "Snack"]
		width: Screen.width
		textAlign: "center"
	}
]
# TIME BLOCKS LOGIC
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
# BG RANGES
# number = prompt("Type in any number!")
# switch(true)
# case (number < 50):
# 	print "case in which number is less than 50"
# 	break
# default:
# 	print "case in which number is not less than 50"
# 	break
	
# ----------- CONTAINERS ----------- #
# NEW ENTRY SCREEN
newEntryContainer = new Layer
	size: Screen.size
	backgroundColor: "#F2F4F7"

# CALCULATION RESULT SCREEN
calculationContainer = new Layer
	size: Screen.size
	backgroundColor: "#F2F4F7"
	
resultsCard = new Layer
	parent: calculationContainer
	width: Screen.width, height: 215, y: 54
	backgroundColor: "white"
	shadow1: {y:1, blur: 1}
	
summaryCard = new Layer
	parent: calculationContainer
	width: Screen.width, height: 265, y: 54 + resultsCard.height + 5
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
	width: Screen.width - 45, height: 20, x: 25, y: navBar.height + 15
	backgroundColor: null
	text: "Meal Time"
	color: "black"
	font: "400 14px/.5 -apple-system, Helvetica Neue"
	shadow1: {y:1}
	
mealTimeSelection = new TextLayer
	parent: newEntryContainer
	width: Screen.width - 45, height: 25, x: 25, y: navBar.height + mealTimeLabel.height + 30
	backgroundColor: null
	text: multiPicker.drum0.value
	color: "black"
	font: "400 16px/.6 -apple-system, Helvetica Neue"
	padding: {left:10}
	shadow1: {y:1}
	
bloodGlucoseLabel = new TextLayer
	parent: newEntryContainer
	width: Screen.width - 45, height: 20, x: 25, y: navBar.height + mealTimeLabel.height + mealTimeSelection.height + 60
	backgroundColor: null
	text: "Blood Glucose (mg/dl)"
	color: "black"
	font: "400 14px/.5 -apple-system, Helvetica Neue"
	shadow1: {y:1}

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
	shadow1: {y:1}
	
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
	
# INPUT VARIABLES
# bgReading = bloodGlucoseInput.value
# carbAmount = carbsInput.value

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

# ----------- CALCULATION RESULTS SCREEN ----------- #

# RESULTS CARD
todayDate = new TextLayer
	parent: resultsCard
	width: Screen.width - 45, height: 20, x: 25, y: 15
	backgroundColor: null
	text: "Today"
	color: "black"
	font: "400 16px/1 -apple-system, Helvetica Neue"

todayTime = new TextLayer
	parent: resultsCard
	width: Screen.width - 45, height: 20, x: todayDate.width - 30, y: 15
	backgroundColor: null
	text: strTime
	color: "#666"
	font: "400 14px/1.2 -apple-system, Helvetica Neue"
	
totalBolusLabel = new TextLayer
	parent: resultsCard
	width: Screen.width/2, height: 20, x: 25, y: todayDate.height + 25
	text: "Total Bolus"
	color: "black"
	font: "400 14px/1 -apple-system, Helvetica Neue"
	
totalBolusResult = new TextLayer
	parent: resultsCard
	width: Screen.width - 45, height: 40, x: 25
	y: todayDate.height + totalBolusLabel.height + 25
	text: ""
	color: "black"
	font: "400 32px/1 -apple-system, Helvetica Neue"
	shadow1: {y:1}
	
totalBolusInput = new InputModule.Input
	parent: resultsCard
	setup: false
	width: Screen.width - 45, height: 40, x: 25
	y: todayDate.height + totalBolusLabel.height + 25
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
# 	seconds = Math.floor((duration / 1000) % 60)
# 	minutes = Math.floor((duration / (60 * 1000)) % 60)
# 	hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
	seconds = (duration / 1000) % 60
	minutes = (duration / (60 * 1000)) % 60
	hours = (duration / (1000 * 60 * 60)) % 24

# 	return Math.floor(hours) + " hrs and " + Math.floor(minutes) + " minutes"
	return Math.round((hours * 10)/10) + " hrs and " + Math.round((minutes * 10)/10) + " minutes"
	
# CONVERTS MILLISECONDS TO MINUTES OR HOURS
decConversion = (duration) ->
	milliseconds = (duration % 1000)
	seconds = (duration / 1000) % 60
	minutes = (duration / (60 * 1000)) % 60
	hours = (duration / (1000 * 60 * 60)) % 24

	return parseFloat(hours + "." + minutes) #parseFloat converts a string ('1.25') into a number (1.25)

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
	print "Insulin Carb: " + insulinCarb
	return insulinCarb
# insulinCarbFunc()
	
# CALCULATE AMOUNT OF INSULIN TO BRING BG DOWN TO TARGET RANGE
insulinCorrectionFunc = ->
	bgReading = bloodGlucoseInput.value
	insulinCorrection = (bgReading - bgTarget) / sensitivityFactor
	print "Insulin Correction: " + insulinCorrection.toFixed(1) + "(u)"
	return insulinCorrection
# insulinCorrectionFunc()

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
	print "Insulin per Hour: " + insulinPerHr + "(u)"
	print "Time elapsed since last injection: " + timeConversion(timeElapse)
	print "Remaining time of IOB: " + timeConversion(timeLeft)	
	print "Remaining amount of IOB: " + insulinOnBoard.toFixed(1) + "(u)"
	return insulinOnBoard
# insulinOnBoardFunc()
	
# CALCULATE TOTAL AMOUNT OF INSULIN TO TAKE
insulinTotalFunc = ->
# 	insulinTotal = (insulinCarbFunc() + insulinCorrectionFunc())
	insulinTotal = (insulinCarb + insulinCorrection) - insulinOnBoard
	print "Insulin Total: " + insulinTotal.toFixed(1)
# 	insulinTotal = (insulinCarbFunc() + insulinCorrectionFunc()) - insulinOnBoardFunc()
# insulinTotalFunc()
	
correctionBolusLabel = new TextLayer
	parent: resultsCard
	width: Screen.width/2, height: 20, x: 25, 
	y: todayDate.height + totalBolusLabel.height + totalBolusResult.height + totalBolusInput.height
	text: "Correction Bolus"
	color: "black"
	font: "400 14px/1 -apple-system, Helvetica Neue"
	
correctionBolusResult = new TextLayer
	parent: resultsCard
	width: 100, height: 20, x: correctionBolusLabel.width * 1.4, 
	y: todayDate.height + totalBolusLabel.height + totalBolusResult.height + totalBolusInput.height
	text: ""
	textAlign: "right"
	color: "black"
	font: "600 14px/1 -apple-system, Helvetica Neue"
	
carbsBolusLabel = new TextLayer
	parent: resultsCard
	width: Screen.width/2, height: 20, x: 25, 
	y: todayDate.height + totalBolusLabel.height + totalBolusResult.height + totalBolusInput.height + correctionBolusLabel.height + 10
	text: "Carbs Bolus"
	color: "black"
	font: "400 14px/1 -apple-system, Helvetica Neue"
	
carbsBolusResult = new TextLayer
	parent: resultsCard
	width: 100, height: 20, x: correctionBolusLabel.width * 1.4, 
	y: todayDate.height + totalBolusLabel.height + totalBolusResult.height + totalBolusInput.height + correctionBolusLabel.height + 10
	text: ""
	textAlign: "right"
	color: "black"
	font: "600 14px/1 -apple-system, Helvetica Neue"
	
IOBLabel = new TextLayer
	parent: resultsCard
	width: Screen.width/2, height: 20, x: 25, 
	y: todayDate.height + totalBolusLabel.height + totalBolusResult.height + totalBolusInput.height + correctionBolusLabel.height + carbsBolusLabel.height + 20
	text: "IOB"
	color: "black"
	font: "400 14px/1 -apple-system, Helvetica Neue"
	
IOBResult = new TextLayer
	parent: resultsCard
	width: 100, height: 20, x: correctionBolusLabel.width * 1.4, 
	y: todayDate.height + totalBolusLabel.height + totalBolusResult.height + totalBolusInput.height + correctionBolusLabel.height + carbsBolusLabel.height + 20
	text: ""
	textAlign: "right"
	color: "black"
	font: "600 14px/1 -apple-system, Helvetica Neue"
	
# SUMMARY CARD
mealTimeLabel = new TextLayer
	parent: summaryCard
	width: Screen.width/2, height: 20, x: 25, y: 20
	text: "Meal Time"
	color: "black"
	font: "400 14px/1 -apple-system, Helvetica Neue"
	
mealTimeValue = new TextLayer
	parent: summaryCard
	width: 200, height: 20, x: mealTimeLabel.width - 18, y: 20
	text: multiPicker.drum0.value
	textAlign: "right"
	color: "black"
	font: "600 14px/1 -apple-system, Helvetica Neue"
	
bgSummaryLabel = new TextLayer
	parent: summaryCard
	width: Screen.width/2, height: 20, x: 25, y: mealTimeLabel.height + 30
	text: "Blood Glucose"
	color: "black"
	font: "400 14px/1 -apple-system, Helvetica Neue"
	
bgSummaryResult = new TextLayer
	parent: summaryCard
	width: Screen.width/2, height: 20, x: bgSummaryLabel.width - 22, y: mealTimeLabel.height + 30
	text: ""
	textAlign: "right"
	color: "black"
	font: "600 14px/1 -apple-system, Helvetica Neue"
	
# CALCULATION ACTIONS
calculateButton.onClick ->
	insulinCarbFunc()
	insulinCorrectionFunc()
	insulinTotalFunc()
	insulinOnBoardFunc()
	totalBolusResult.text = insulinTotal.toFixed(1) + " u"
	correctionBolusResult.text = insulinCorrection.toFixed(1) + " u"
	carbsBolusResult.text = insulinCarb.toFixed(1) + " u"
	IOBResult.text = insulinOnBoard.toFixed(1) + " u"
	bgSummaryResult.text = bgReading + " mg/dL"
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