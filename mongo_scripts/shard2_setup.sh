#!/bin/bash

sudo mkdir -p /mnt/crypto/mongodb/shard2
sudo chmod 777 /mnt/crypto/mongodb/shard2
mongod --replSet shard2 --logpath "/mnt/crypto/mongodb/logs/shard2.log" --dbpath /mnt/crypto/mongodb/shard2 --bind_ip 192.168.1.31 --port 27002 --shardsvr &
