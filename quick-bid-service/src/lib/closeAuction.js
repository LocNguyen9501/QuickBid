import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function closeAuction(auction){
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {id: auction.id},
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status' : 'CLOSES',
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        }
    };

    try {
        const result = await dynamodb.update(params).promise();
        return result;
    } catch (error) {
        console.log(error);
    }
}