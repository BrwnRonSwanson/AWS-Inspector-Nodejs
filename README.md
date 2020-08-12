# AWS-Inspector-Nodejs

This script is used in two parts. One, to get the most recent finding and then export it to an S3 bucket of your choosing. The second part takes the most recent finding ARN and then generates individual .txt files for each finding associated with that finding ARN. 

 - To function properly, you need to include the bucket you'd like your most recent inspector scan to be placed in.
 - You need to make sure you run an inspector scan so that the script has something to grab. You can run an inspector scan in the GUI by selecting the "inspector"    service from the AWS menu.
 - Run the "get_Recent_Scans.js first and then the "inspector_list_describe_findings.js"
 - In the second script you need to update the params field with the value from the text file in the "get_Recent_Scans.js" script
 - You must also update the bucket name in the "inspector_list_describe_findings.js" script"
 
 These scripts can also be combined and placed on a Lambda for automated reporting
