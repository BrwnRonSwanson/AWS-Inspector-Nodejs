//AWS Node SDK requirements
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});
const FileSystem = require('fs');
const inspector = new AWS.Inspector();
const s3 = new AWS.S3();

//Get latest scan ARN
let params = {
       assessmentRunArns: [
           "<ARN from exported TXT file from get_Recent_Scans>"
        ]
    };
    
//Get findings ARN
try {
    console.log('Your script is running...')
    function findings(){
        inspector.listFindings(params, function(err, data) {
            if (err) console.log(err) 
            else {

                //Pass nextToken to start pagination
                if (data.nextToken) {
                    params['nextToken'] = data['nextToken']
                    const detailFinding = (data.findingArns)
                    for (let [key, value] of Object.entries(detailFinding)) {
                        const arn = {
                            findingArns: [value]
                        }
                        const arnKey = JSON.stringify(arn)

                        //Pass ARN value for finding to describeFinding's API
                        inspector.describeFindings(arn, function(err, dataTwo) {
                            const stringData = JSON.stringify(dataTwo)
                            //console.log(arn)
                            
                            /*S3 bucket to store JSON blobs note "Key" is set to finding ARN as
                             to not overwrite single JSON object per finding*/
                            const bucketItem = {
                                Body: stringData,
                                Key: arnKey,
                                Bucket:"<Your bucket name>",
                                ServerSideEncryption: "AES256"
                            } 
                            
                            //txt file output and put object to S3
                            FileSystem.appendFileSync("./nextPage.txt", stringData)
                            s3.putObject(bucketItem, function(err, dataThree) {
                                //console.log(dataThree)
                            })
                        })
                        }
                    //Call the function again until "nextToken is false"
                    findings()
    
                    
            }
        }
        });
    }setTimeout(function(){console.log(`The finding report was successful! \nPlease check the <bucket name> \nbucket for the output.`)
}, 3000)
}catch(e) {
    console.log(e)
}

findings()



