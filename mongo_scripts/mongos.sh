#!/bin/bash

sudo mkdir /mnt/crypto/mongodb/mongos
sudo chmod 777 /mnt/crypto/mongodb/mongos
mongos --configdb conf/192.168.1.32:27011 --port 27020 --bind_ip 192.168.1.32 --logpath "/mnt/crypto/mongodb/mongos/log.log" &
sleep 75

db.adminCommand({addshard: "shard1/192.168.1.32:27001"})
db.adminCommand({addshard: "shard2/192.168.1.31:27002"})