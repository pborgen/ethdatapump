sudo mkdir -p /mnt/crypto/mongodb/logs/shard2
sudo chmod 777 /mnt/crypto/mongodb/logs/shard2
sudo mkdir -p /mnt/crypto/mongodb/shard2
sudo chmod 777 /mnt/crypto/mongodb/shard2
mongod --replSet shard2 --logpath "/mnt/crypto/mongodb/logs/shard2/shard2.log" --dbpath /mnt/crypto/mongodb/shard2 --bind_ip 192.168.1.31 --port 27002 --shardsvr &

sleep 10

mongo --host 192.168.1.31 --port 27002 --eval 'rs.initiate({_id: "shard2", members: [{_id: 0, host: "192.168.1.31:27002"}]})'


#mongo --host 192.168.1.31 --port 27002 > shard1_replicaset.js &
sleep 5
mongo --host 192.168.1.31 --port 27002 --eval "printjson(db.serverStatus())" &
mongo --host 192.168.1.31 --port 27002 --eval "printjson(rs.status())" &

exit 0