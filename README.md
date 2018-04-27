# Sweet Spot Diabetes App
by Ed Monterrubio</bnr>
March 6, 2018

<a href="https://framer.cloud/kcoOh" target="_blank">View Prototype</a>

## App Synopsis:
SweetSpot helps remove the daily diabetic cycle burden of keeping track of insulin dosages and doing the complex math of insulin dosage calculations for you. Once you enter your blood glucose reading and your carb intake sweet spot does all the complicated calculations using your preset factors determined by you and your doctor. It takes any previous log data, producing an insulin dosage amount that is much more accurate and faster than doing it yourself.

## Requirements:
The app needs to accurately calculate and display the <strong><i>amount of insulin</i></strong> needed to take at any given time. It should refer to stored data (history log), take in new data (blood glucose, timestamp, datestamp, carbs), <strong><i>calculate amount of insulin</i></strong> (bolus) based on previous and new data, and store / write data. The prototype needs to connect to a database.

## Terms and Variables:
<strong>bgReading</strong>: Blood Glucose Reading (BG)</br>
<strong>bgTarget</strong>: Target number you want your blood sugar to be</br>
<strong>insulinOnBoard</strong>: Insulin on Board (IOB) is the amount of insulin actively working in the body</br>
<strong>insulinCarb</strong>: Amount of insulin needed to cover the carbs consumed</br>
<strong>insulinCorrection</strong>: Amount of insulin needed to bring your BG down to the target value</br>
<strong>insulinTotal</strong>: Total amount of insulin to take to bring your BG down to the target value</br>
<strong>carbAmount</strong>: Amount of carbs you are eating in grams</br>
<strong>carbFactor</strong>: How many units of insulin to take per grams of carbs ratio</br>
<strong>sensitivityFactor</strong>: Amount of BG points dropped per unit of insulin</br>
<strong>insulinPrev</strong>: Previous amount of insulin taken in units</br>
<strong>insulinPerHr</strong>: How many units of insulin is used per hour</br>
<strong>timeLeft</strong>: How much time is left before active insulin in body is complete</br>
<strong>timeElapse</strong>: How much time has passed since the last dose of insulin was taken</br>
<strong>timePrev</strong>: Last time insulin was taken</br>
<strong>timeCurrent</strong>: Current UTC time in milliseconds

## Math Calculations:
##### CARB INSULIN:
<strong>insulinCarb</strong> = carbAmount / carbFactor

##### CORRECTION INSULIN:
<strong>insulinCorrection</strong> = (bgReading - bgTarget) / sensitivityFactor

##### INSULIN ON BOARD:
<strong>insulinPerHr</strong> = lastBolusAmount / 3
<i>// 3 is the number of hours it takes insulin to run it’s course</i>
<strong>timeElapse</strong> = timeCurrent - timeLastBolus
<i>// if timeElapse is >= 3 then insulinOnBoard = 0</i>
<strong>timeLeft</strong> = 3 - timeElapse
<strong>insulinOnBoard</strong> = insulinPerHr * timeLeft

##### TOTAL INSULIN TO TAKE:
<strong>insulinTotal</strong> = (insulinCarb + insulinCorrection) - insulinOnBoard

## Time Blocks:
These are acceptable fixed value ranges provided by the endocrinologist that will change only when the doctor approves.

##### Morning Time Block
12:00 am - 5:59 am
carbFactor = 10
sensitivityFactor = 50
bgTarget = 140

##### Daytime Time Block
6:00 am - 7:59 pm
carbFactor = 8
sensitivityFactor = 45
bgTarget = 100

##### Nighttime Time Block
8:00 pm - 11:59 pm
carbFactor = 10
sensitivityFactor = 50
bgTarget = 140
