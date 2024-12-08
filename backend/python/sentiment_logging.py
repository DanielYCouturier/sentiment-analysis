from sys import stderr

def catch_all(run):
    try:
        run()
    except Exception as e:
        stderr.write(e)
        exit()
def log(message):
    stderr.write("INFO: "+str(message)+"\n")