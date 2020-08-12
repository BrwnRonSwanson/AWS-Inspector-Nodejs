const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
const FileSystem = require('fs');
const inspector = new AWS.Inspector();
const s3 = new AWS.S3();

try {
    function report() {
        const targets = inspector.listAssessmentTargets()
        const targetsResponse = targets.send(function(err, targetArns) {
            if (err) {console.log(`Error with targets function: ${err}`)}
            const targetParams = targetsResponse.data
            const assessments = inspector.listAssessmentTemplates(targetParams)
            assessments.send(function(err, assessmentTemplateArns) {
                if (err) {console.log(`Error with assessments function: ${err}`)}
                const scanTemplate = assessmentTemplateArns
                inspector.listAssessmentRuns(scanTemplate, function(err, data) {
                    if (err) {console.log(`Error with assessments runs function: ${err}`)}
                    const mostRecentScan = data.assessmentRunArns[0]
                    const bucketItem = {
                        Body: mostRecentScan,
                        Key: "most recent scan",
                        Bucket:"<bucketname>",
                        ServerSideEncryption: "AES256"
                    } 
                    s3.putObject(bucketItem).send()
                    FileSystem.writeFileSync("./arn_report.txt", mostRecentScan)

                    setTimeout(function(){console.log(`Most recent scan report was successful! \nHere is your most recent scan arn: ${mostRecentScan}`)
                }, 2000)

                })
    
            })
        })
    } report()
} catch(err) {console.log(`Hmmm.... Something went wrong, here is the error: ${err}`)}
