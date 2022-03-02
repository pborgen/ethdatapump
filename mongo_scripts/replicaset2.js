config = { 
    _id: "shard2", 
    members: [
        {_id: 0, host: "192.168.1.32:27002"}
    ]

};

rs.initiate(config);
rs.status();