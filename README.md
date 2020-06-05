# Chat server using TypeORM.

Although http requests might not be the best choice for developing a realtime chat, it was a good example to learn typeorm.

Because I'm using http requests and a rest endpoint, I must have a polling to check for new messages. The endpoint responsible for that only returns the messages that the client doesn't have (to accomplish this I return messages since the datetime of the last one the client received).
