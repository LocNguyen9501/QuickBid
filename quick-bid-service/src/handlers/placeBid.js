import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import createError from 'http-errors';
import createPlaceBidSchema from '../lib/schemas/createPlaceBidSchema';
import { getAuctionByID } from './getAuction';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    const { id } = event.pathParameters;
    const { amount } = event.body;

    const auction = await getAuctionByID(id);

    if(amount <= auction.highestBid.amount){
        throw new createError.Forbidden('Bid is too low bro');
    }

    if(auction.status !== 'OPEN'){
        throw new createError.Forbidden("Can't bid on closed auction");
    }

    const params = {
        tableName: process.env.AUCTION_TABLE_NAME,
        Key: {id},
        updateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
            ':amount': amount,
        },
        ReturnValues: 'ALL_NEW',
    };

    let updateAuction;

    try {
        const result = await dynamodb.update(params).promise();
        updateAuction = result.Attributes;
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updateAuction)
    };
}

export const handler = commonMiddleware(placeBid).use(validator({inputSchema:createPlaceBidSchema}));