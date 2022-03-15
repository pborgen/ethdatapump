#!/bin/bash

sudo mkdir -p /mnt/crypto/mongodb/configserver1
sudo chmod 777 /mnt/crypto/mongodb/configserver1
sudo mongod --logpath "/mnt/crypto/mongodb/configserver.log" --port 27011 --dbpath /mnt/crypto/mongodb/configserver1 --replSet conf --bind_ip 192.168.1.32  --configsvr &

sleep 10

mongo --host 192.168.1.32 --port 27011 --eval 'rs.initiate({_id: "conf", members: [{_id: 0, host: "192.168.1.32:27011"}]})'

sleep 5
mongo --host 192.168.1.32 --port 27011 --eval "printjson(db.serverStatus())" &
mongo --host 192.168.1.32 --port 27011 --eval "printjson(rs.status())" &