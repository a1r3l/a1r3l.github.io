import SimpleHTTPServer
import SocketServer
import BaseHTTPServer
import os
 
HOSTNAME, PORT = "localhost", 8090
 
HANDLER = SimpleHTTPServer.SimpleHTTPRequestHandler
 
#os.chdir('./entorns')
 
httpd = SocketServer.TCPServer((HOSTNAME , PORT), HANDLER)
 
print("Server runs in port ", PORT)
httpd.serve_forever()
