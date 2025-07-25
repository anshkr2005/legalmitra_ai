# Add this to your app.py file to enable the debug console

@app.route('/debug')
def debug_console():
    """Debug console for troubleshooting the application"""
    return render_template('debug.html')
