# SESSION HANDOFF - PROJECT TEMPLATE 
     * Date and Time: 2025-12-24-1405
     * Session Goal: ********************



********IF WORKING ON IMAGE GENERATION *************

# INTELLECTUAL PROPERTY NOTICE:  The contents if this chat and everything related to this project is subject to my copyright and may not be used to train AI models or for any purpose. 

# REFERENCE MATERIAL
Please find attached background documents for the Event Finder project.  Please read the attached documents and confirm your understanding of the project. I have attached:
     * Session Handoff document (current status)
     * Tech_Architecture_and_Approach.md (full project reference)
     * The UI
     * A sample graphic image.
     * C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL\Documentation\User Interface\Graphic Generation\2025-12-21-1943 ChatGPT Graphics Files for Claude\eventfinder-icon-worker-v2.7\Image_Generation_Safety_Abstraction_Policy_v2.7.md
     * icon-worker/src/rules.js
     * icon-worker/src/policyEngine.js
     * icon-worker/src/validators.js

# WHAT I WAS LAST WORKING ON
     * Last Task: Generating topic icons for new event combinations.
     * Where I Left Off: Icons generated but some failed OCR validation

# NEXT STEPS
     * Create image_generation_errors Collection in PocketBase using our standard approach for modifying PocketBase
          ** Add Fields: 
               *** Name: record_id
               *** Type: Text
               *** Options:

               *** Name: topic_combination
               *** Type: Text
               *** Options:

               *** Name: error_type
               *** Type: Select
               *** Options: Values: ocr, panels, downscale, api_error, network, unknown

               *** Name: error_message
               *** Type: Text
               *** Options:

               *** Name: attempt_count
               *** Type: Number
               *** Options:

               *** Name: created
               *** Type: Autodate
               *** Options: (automatic)
     * Fix OCR sensitivity threshold
     * Generate icons for remaining 15 combinations
     * Update UI to display icons on event cards"]

# ACTION: Please help me execute next steps to resolve ongoing issues with getting ChatGPT to generate good images and how we need to prepare the database and code to accommodate them.



 ************* IF WORKING ON SCRAPING *************
# INTELLECTUAL PROPERTY NOTICE:  The contents if this chat and everything related to this project is subject to my copyright and may not be used to train AI models or for any purpose. 

# REFERENCE MATERIAL 
Please find attached background documents for the Event Finder project.  Please read the attached documents and confirm your understanding of the project. I have attached:
     * Session Handoff document (current status)
     * Tech_Architecture_and_Approach.md (full project reference)
     * Relevant scraper file - C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL \ scrape-cfr-events.js)
     *Relevant scraper file -  C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL \ base-scraper.js

# WHAT I WAS LAST WORKING ON
     * Last Task: Generating emails to points of contact at organizations of interest
     * Where I Left Off: 

# NEXT STEPS
     * @@@@@@@@@@@@@@@@@@@@@ WHAT WE NEED TO DO @@@@@@@@@@@@@@@@@@@@@


# ACTION: Please help me execute next steps to @@@@@@@@@@@@@@@@@@@@@ FIX PROBLEM @@@@@@@@@@@@@@@@@@@@@
 


 ************* IF WORKING ON UI *************
# INTELLECTUAL PROPERTY NOTICE:  The contents if this chat and everything related to this project is subject to my copyright and may not be used to train AI models or for any purpose. 

# REFERENCE MATERIAL
Please find attached background documents for the Event Finder project.  Please read the attached documents and confirm your understanding of the project. I have attached:
     * Session Handoff document (current status)
     * Tech_Architecture_and_Approach.md (full project reference)
     * UI File - C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL \ index.html or event-finder-ui-v7.html

# WHAT I WAS LAST WORKING ON
     * Last Task: @@@@@@@@@@@@@@@@@@@@@.
     * Where I Left Off: @@@@@@@@@@@@@@@@@@@@@

# NEXT STEPS
     * @@@@@@@@@@@@@@@@@@@@@ WHAT WE NEED TO DO @@@@@@@@@@@@@@@@@@@@@


# ACTION: Please help me execute next steps to @@@@@@@@@@@@@@@@@@@@@FIX PROBLEM @@@@@@@@@@@@@@@@@@@@@
 


 ************* IF WORKING ON DATA AND TOPICS *************
# INTELLECTUAL PROPERTY NOTICE:  The contents if this chat and everything related to this project is subject to my copyright and may not be used to train AI models or for any purpose. 

# REFERENCE MATERIAL
Please find attached background documents for the Event Finder project.  Please read the attached documents and confirm your understanding of the project. I have attached:
     * Session Handoff document (current status)
     * Tech_Architecture_and_Approach.md (full project reference)
     * C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL \ update-event-topics.js
     * C:\LOCAL FILES\AI Stuff - LOCAL\Event Finder - LOCAL \ update-topic-icons.js
     * Instructions to Update PocketBase UI - Collections / Fields / Settings


# WHAT I WAS LAST WORKING ON
     * Last Task: @@@@@@@@@@@@@@@@@@@@@.
     * Where I Left Off: @@@@@@@@@@@@@@@@@@@@@

# NEXT STEPS
     * @@@@@@@@@@@@@@@@@@@@@ WHAT WE NEED TO DO @@@@@@@@@@@@@@@@@@@@@


# ACTION: Please help me execute next steps to @@@@@@@@@@@@@@@@@@@@@FIX PROBLEM @@@@@@@@@@@@@@@@@@@@@

