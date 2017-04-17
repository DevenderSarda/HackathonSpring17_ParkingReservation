# HackathonSpring17_ParkingReservation

Go Parking is an online parking reservation web application developed on MEAN stack. It helps users to find the right parking area and reserve it.

Application Demo: https://youtu.be/eR9XB1qSB68

-->The application provides user registration form for user to sign into the application. User can take the benefit of Facebook or Google O Auth to validate himself/herself into the application. 

-->User can find the right parking location by entering the address/landmark/city. Using the information, the application makes a REST API service call to ParkWhiz api to fetch the parking details.  The results are shown in two views for better user experience. The parking locations are shown on Google Maps as well as List View. User can then select any one parking location which shows the parking layout of the building.  The user gets to choose from any available parking slots to proceed further to reserve the spot. The parking details like Location Name, Location Address, Price, From Time, To Time and vehicle registration number are taken to make a reservation.  The details are then pushed into mongoDB and an email confirmation is trigerred from nodejs which is sent to registered emailid. 

-->The application also provides feature for the user to delete his reservation or user account. This can be accessed from 'My Account' page of the application.  

###Technologies Used:  
1. MEAN stack 
2. Google Maps API 
3. Bootstrap, jQuery 
4. Amazon Web services
