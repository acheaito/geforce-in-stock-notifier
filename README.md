# NOTICE
AUTHOR HAS NO AFFILIATION WITH NVIDIA&reg;  

# In Stock Notifier
A NodeJS script that checks if a certain GeForce 10 series item is in stock on nvidia's website. 
The script can be scheduled to run periodically via cron on Linux, or Task Scheduler on Windows.

## Requirements
- NodeJS (Tested with V9.4.0)
- npm (Tested with 5.6.0)

## Usage

### First Time
Update src/config/config.ini for the following:
* Item ID and Item Name (currently set to NVIDIA&reg; GeForce&reg; GTX 1080 TI)
* Receiver email address
* Sender gmail address
* Sender [gmail app password](https://support.google.com/mail/answer/185833?hl=en)

Once configured, execute the following command to try out the script:
```bash
npm install
npm start
```

### Afterwards
Schedule a task to execute the following command in the script working directory:
```bash
npm start
```
## Resources
* [NodeJS and NPM (included) Download](https://nodejs.org/en/)
* [Scheduling tasks with Windows Task Scheduler](https://docs.microsoft.com/en-us/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc748993(v=ws.11))
* [Scheduling tasks with cron](https://www.techrepublic.com/blog/linux-and-open-source/schedule-periodic-tasks-with-cron/)
