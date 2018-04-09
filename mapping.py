coord_file = open("airports.dat")
coord_data = coord_file.readlines()
coord_file.close()
airport_coords = {}
for i in range(0, len(coord_data)):
	coord_data[i] = coord_data[i].rstrip('\n').split(',')
	# print coord_data[i
	if coord_data[i][4] not in airport_coords.keys():
		try:
			IATA_code = coord_data[i][4][1:len(coord_data[i][4])-1]
			if len(IATA_code) > 1:
				airport_coords[IATA_code] = [float(coord_data[i][6]), float(coord_data[i][7]), coord_data[i][2], coord_data[i][3], coord_data[i][1], coord_data[i][5]]
		except:
			IATA_code = coord_data[i][5][1:len(coord_data[i][4])-1]
			if len(IATA_code)>1:
				airport_coords[IATA_code] = [float(coord_data[i][7]), float(coord_data[i][8]), coord_data[i][3], coord_data[i][4], coord_data[i][1], coord_data[i][5]]

airlines_file = open("airlines.dat")
airlines_data = airlines_file.readlines()
airlines_file.close()
airlines = {}

for i in range(0,len(airlines_data)):
	airlines_data[i] = airlines_data[i].rstrip('\n').split(',')
	airline_ID = airlines_data[i][0][1:len(airlines_data[i][0])-1]
	IATA_code = airlines_data[i][3][1:len(airlines_data[i][3])-1]
	ICAO_code = airlines_data[i][4][1:len(airlines_data[i][4])-1]
	airline_name = airlines_data[i][1][1:len(airlines_data[i][1])-1]
	airline_alias = airlines_data[i][2][1:len(airlines_data[i][2])-1]
	airline_callsign = airlines_data[i][5][1:len(airlines_data[i][5])-1]
	airline_country = airlines_data[i][6][1:len(airlines_data[i][6])-1]
	airline_active = airlines_data[i][7][1:len(airlines_data[i][7])-1]
	if airline_ID not in airlines.keys():
		airlines[IATA_code] = [airline_name, airline_alias, airline_callsign, airline_country, airline_active, IATA_code, ICAO_code]
		# print airline_ID

# print airlines

route_file = open("routes.dat")
route_data = route_file.readlines()
route_file.close()
routes = []

# print len(route_data)
for i in range(0, len(route_data)):
	route_data[i] = route_data[i].rstrip('\n').split(',')
	count = 0
	if route_data[i][2] in airport_coords.keys() and route_data[i][4] in airport_coords.keys():
		print route_data[i][0]
		if route_data[i][0] in airlines.keys():
			routes.append([route_data[i][2], route_data[i][4], airport_coords[route_data[i][2]][0], airport_coords[route_data[i][2]][1], airport_coords[route_data[i][4]][0], airport_coords[route_data[i][4]][1], \
				airport_coords[route_data[i][2]][2], airport_coords[route_data[i][2]][3], airport_coords[route_data[i][4]][2], airport_coords[route_data[i][4]][3], \
				route_data[i][6], route_data[i][0], route_data[i][8].rstrip('\n'), airlines[route_data[i][0]][0], airlines[route_data[i][0]][1], \
                                       airlines[route_data[i][0]][2], airlines[route_data[i][0]][3], airlines[route_data[i][0]][4], \
                                       airport_coords[route_data[i][2]][4], airport_coords[route_data[i][4]][4], airport_coords[route_data[i][2]][5], airport_coords[route_data[i][4]][5] ])
			count += 1
		else:
			routes.append([route_data[i][2], route_data[i][4], airport_coords[route_data[i][2]][0], airport_coords[route_data[i][2]][1], airport_coords[route_data[i][4]][0], airport_coords[route_data[i][4]][1], \
				airport_coords[route_data[i][2]][2], airport_coords[route_data[i][2]][3], airport_coords[route_data[i][4]][2], airport_coords[route_data[i][4]][3], \
				route_data[i][6], route_data[i][0], route_data[i][8].rstrip('\n'), 'NA', 'NA', 'NA', 'NA', 'NA',\
                                       airport_coords[route_data[i][2]][4], airport_coords[route_data[i][4]][4], airport_coords[route_data[i][2]][5], airport_coords[route_data[i][4]][5]])
			count +=1

	# print count
"""
Each line of routes list contains:
0) Source airport IATA code
1) Destination airport IATA code
2) Source Airport Latitude
3) Source Airport Longitude
4) Destination Airport Latitude
5) Destination Airport Longitude
6) Source Airport City
7) Source Airport Country
8) Destination Airport City
9) Destination Airpoty Country
10) Codeshare - Y/N
11) Airline IATA code
12) Equipment - 3 letter code for plane type
13) Airline Name
14) Airline Alias
15) Airline Callsign
16) Airline Country
17) Airline Active (Y or N or //N for Null)
18) Source Airport Name
19) Destination Airport Name
20) Source airport ICAO code
21) Destination airport ICAO code

"""

out_file = open("comprehensive_data.dat", "w")
for line in routes:
	for element in line:
		out_file.write(str(element))
		out_file.write(',')
	out_file.write('\n')
out_file.close()
