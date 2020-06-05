# Chat server using TypeORM.

Although http requests might not be the best choice for developing a realtime chat, it was a good example to learn typeorm.

I must have a polling to check for new messages because I'm using http requests and a rest endpoint. The endpoint responsible for that only returns the messages that the client doesn't have (to accomplish this I return messages since the datetime of the last one the client received).
