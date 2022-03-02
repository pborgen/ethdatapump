config = { 
    _id: "conf", 
    members: [
        {_id: 0, host: "192.168.1.32:27011"}
    ]

};

rs.initiate(config);
rs.status();