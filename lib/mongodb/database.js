const mongoose = require('mongoose');


module.exports = {
    connect: async (id, settings, status) => {
        await mongoose.connect(id, settings);
    },
    log: (atlas) => {

        // on open
        atlas.once('open', () => {
            console.log('Fetching to database....')
            atlas.close();
        })

        // on error
        atlas.on('error', () => {
             console.log('Error occured while sending a ping on database')
             atlas.close();
        })
 
         // on disconnect 
         atlas.on('disconnecting', () => {
            console.log('Fetching to database indentified, temporarily closing connection....' + '\n')
            atlas.close();
         })
    }
}
