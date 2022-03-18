#!/bin/bash


sudo mkdir -p /mnt/crypto/mongodb/shard1
sudo chmod 777 /mnt/crypto/mongodb/shard1
mongod --replSet shard1 --logpath "/mnt/crypto/mongodb/logs/shard1.log" --dbpath /mnt/crypto/mongodb/shard1 --bind_ip 192.168.1.32 --port 27001 --shardsvr &

sleep 10

mongo --host 192.168.1.32 --port 27001 --eval 'rs.initiate({_id: "shard1", members: [{_id: 0, host: "192.168.1.32:27001"}]})'


#mongo --host 192.168.1.32 --port 27001 > shard1_replicaset.js &
sleep 5
mongo --host 192.168.1.32 --port 27001 --eval "printjson(db.serverStatus())" &
mongo --host 192.168.1.32 --port 27001 --eval "printjson(rs.status())" &

exit