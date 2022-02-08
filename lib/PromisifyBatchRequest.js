
class PromisifyBatchRequest {

    constructor(web3) { 
        this.batch = new web3.BatchRequest();
        this.requests = [];
    }
    
    add(_request, ...params) {
        let that = this;
        let request = new Promise((resolve, reject) => {
            that.batch.add(_request.call(null, ...params, (err, data) => {
                if (err) {
                    console.error('Error adding to the batch. Error:' + err);

                    return reject(err);
                }
                resolve(data);
            }));
        });
        this.requests.push(request);
    }

    async execute() {
        this.batch.execute();

        return Promise.all(this.requests);
    }

    print(){
      console.log('Name is :'+ this.name);
    }
  }

  module.exports = PromisifyBatchRequest;