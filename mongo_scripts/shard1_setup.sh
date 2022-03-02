sudo mkdir -p /mnt/crypto/mongodb/shard1
sudo chmod 777 /mnt/crypto/mongodb/shard1
mongod --replSet shard1 --logpath "/mnt/crypto/mongodb/shard1/log.log" --dbpath /mnt/crypto/mongodb/shard1 --port 27001 --shardsvr &
