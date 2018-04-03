# nested_apps
Using sapUI5 to create an Application with multiple nested Applications inside.


The high level template App is using a dummy model - UI_Struktur.json, to manage nested Apps inside it.
The nested App solution is mandatory due to the future advantage of using each of them as a stand-alone application.

# App Flow
Main.view.xml is going through the model and loading requested nested Apps.
Each nested App is loaded in an Object Page Block.
There is a bug where the the Object Page Blocks are not shown properly.
Desireable Display:

* Section 1:
  * Subsection 1:
    * Block 1
* Section 2:
  * Subsection 2:
    * Block 2
    * Block 3
    * Block 4
* Section 3:
  * Subsection 3:
    * Block 5   
    
   
Actual Display:

* Section 1:
  * Subsection 1:
    * Block 1
* Section 2:
  * Subsection 2:
    * Block 2
* Section 3:
  * Subsection 3:
    * Block 3   
* Block 4
* Block 5
