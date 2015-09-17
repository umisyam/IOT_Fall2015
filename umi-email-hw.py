#!/usr/bin/env python
#### HOMEWORK ATTEMPT 1 - UMI SYAM

import feedparser
import time	
import smtplib

user='shakti.syam.99@gmail.com'		
passwd='dumzidumzi'

fromaddr = 'shakti.syam.99@gmail.com'
toaddrs  = 'shakti.syam.99@gmail.com'

newmails = feedparser.parse("https://" + user + ":" + passwd + "@mail.google.com/gmail/feed/atom").entries

#this function searches your inbox based on substring (takes string input)
def searchEmail(searchTitle):
	arrayOfEmailSubject = []
	arrayOfEmailSummary = []
	print '----------SEARCH RESULT:----------'
	for i in newmails:		
	    if searchTitle in str(i.title):
	    	print 'Subject: ' + str(i.title) + "\n" + i.summary
	    	print '--------------------------------'
	    	
		arrayOfEmailSubject.append(str(i.title))
		arrayOfEmailSummary.append(i.summary)
	
	# return i.title + "\n" + i.summary 

	c = str(arrayOfEmailSubject).split(',') 
	d = str(arrayOfEmailSummary).split(',') 
	return str(c) + "\n" + str(d)

#this function searches your inbox based on the array index (takes integer input)
def searchEmailByIndex(emailIndex):
	a = newmails[emailIndex].title
	b = newmails[emailIndex].summary
	print "Title of Email ID #" + str(emailIndex) + " : " + a
	print '--------------------------------'
	return 'Email Subject: ' + str(a) + '\nEmail Body: ' + str(b)

#loops forever every 60 seconds
while True: 
	prompt1 = raw_input("Search Your Inbox: ")
	result1 = searchEmail(prompt1)
	
	prompt2 = int(raw_input("Enter Email Index: "));
	result2 = searchEmailByIndex(prompt2)
	
	SUBJECT1 = 'Search Result based on keyword "' + str(prompt1) + '".'
	TEXT1 = str(result1)
	msg1 = 'Subject: %s\n\n%s' % (SUBJECT1, TEXT1)
	
	SUBJECT2 = 'Output Result from Email #' + str(prompt2)
	TEXT2 = str(result2)
	msg2 = 'Subject: %s\n\n%s' % (SUBJECT2, TEXT2)

	print(msg1)
	smtpserver = smtplib.SMTP('smtp.gmail.com', 587)
	# smtpserver.ehlo()
	smtpserver.starttls()
	smtpserver.login(user, passwd)

	print "Sending 1st email.."
	smtpserver.sendmail(user, user, msg1)
	print "Sending 2nd email.."
	smtpserver.sendmail(user, user, msg2)
	print "Email(s) sent!"
	smtpserver.quit()


	time.sleep(60)


