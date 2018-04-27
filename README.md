# Sweet Spot Diabetes App
by Ed Monterrubio

<a href="https://framer.cloud/kcoOh" target="_blank">View Prototype</a>

## App Synopsis
Type 1 diabetes is a 24-7 balancing act between food, life events, and your blood sugar. Being able to accurately calculate and display the right amount of insulin one must administer at any given time is a complicated and cumbersome process often susceptible to human error. Sweet Spot takes the burden away by streamlining the process and doing the calculations for you based on current blood glucose readings, carb intake, data from previous entries and personalized physician guidelines. It makes living with type 1 diabetes a little bit sweeter.

## Prototype Requirements
The app needs to accurately calculate and display the amount of insulin needed to take at any given time. It should refer to stored data (history log), take in new data (blood glucose, timestamp, datestamp, carbs), calculate amount of insulin (bolus) based on previous and new data, and store / write data. The prototype is currently linked to a firebase database.

## Terms and Variables
<strong>bgReading</strong> = Blood Glucose Reading (BG)
<strong>bgTarget</strong> = Target number you want your blood sugar to be
<strong>insulinOnBoard</strong> = Insulin on Board (IOB) is the amount of insulin actively working in the body
<strong>insulinCarb</strong> = Amount of insulin needed to cover the carbs consumed
<strong>insulinCorrection</strong> = the amount of insulin needed to bring your BG down to the target value
<strong>insulinTotal</strong> = the total amount of insulin to take to bring your BG down to the target value
<strong>carbAmount</strong> = the amount of carbs you are eating in grams
<strong>carbFactor</strong> = how many units of insulin to take per grams of carbs ratio - given by doctor (1u insulin per every 10 g of carbs)
<strong>sensitivityFactor</strong> = the amount of BG points dropped per unit of insulin - given by doctor (45 during day, 50 during night 9pm - 6am)
<strong>insulinPrev</strong> = previous amount of insulin taken in units
<strong>insulinPerHr</strong> = how many units of insulin is used per hour
<strong>timeLeft</strong> = how much time is left before active insulin in body is complete
<strong>timeElapse</strong> = how much time has passed since the last dose of insulin was taken
<strong>timePrev</strong> = the last time insulin was taken
<strong>timeCurrent</strong> = the current time
