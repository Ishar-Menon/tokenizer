from flask import Blueprint
from flask import current_app as app
from middleware.middleware import auth
from pandas import read_csv
from matplotlib import pyplot
from statsmodels.graphics.tsaplots import plot_pacf, plot_acf
from statsmodels.tsa.arima_model import ARIMA
import statsmodels.api as sm
import pandas as pd
import time
import threading
import os
from sklearn.metrics import mean_squared_error
timeSeries_bp = Blueprint('timeSeries_bp', __name__)


def updateTestAndTrain():
    global train
    global test
    global value
    while(True):
        time.sleep(value)
        dataRow = test.head(1)
        train = pd.concat([train, dataRow], axis=0).reset_index(drop=True)
        test = test.iloc[1:]


dir_path = os.path.dirname(os.path.realpath(__file__))
Foreign_Exchange_Rates = pd.read_csv(dir_path + "/dataset.csv")
df = Foreign_Exchange_Rates[['Time Serie',
                             'AUSTRALIA - AUSTRALIAN DOLLAR/US$']]
gdf = df[df['AUSTRALIA - AUSTRALIAN DOLLAR/US$'] == 'ND']
df = pd.concat([df, gdf, gdf]).drop_duplicates(keep=False)
df = df.reset_index(drop=True)
#plot_pacf(df['AUSTRALIA - AUSTRALIAN DOLLAR/US$'], lags=5)
#plot_acf(df['AUSTRALIA - AUSTRALIAN DOLLAR/US$'],lags=3000)
df.rename(columns={'Time Serie': 'index'}, inplace=True)
df.rename(columns={'AUSTRALIA - AUSTRALIAN DOLLAR/US$': 'value'}, inplace=True)
df = pd.DataFrame(df.value.astype(float))
X = df.value
size = int(len(X) * 0.66)
train, test = X[0:size], X[size:len(X)]
value = 300
t1 = threading.Thread(target=updateTestAndTrain, args=())
t1.start()


# List products with their information
# (Inforamtion passed from client - items to skip)
@timeSeries_bp.route('/api/predict/<flag>', methods=['GET'])
@auth
def predict(flag):
    global train
    history = [x for x in train]
    model = ARIMA(history, order=(1, 0, 0))
    model_fit = model.fit(disp=0)
    if(flag == '0'):
        output = model_fit.forecast()
        yhat = output[0]
        yhat = str(yhat)
        return yhat, 200

    elif(flag == '1'):
        output = model_fit.forecast(7)
        yhat = output[0]
        yhat = str(yhat)
        return yhat, 200

    elif(flag == '2'):
        output = model_fit.forecast(30)
        yhat = output[0]
        yhat = str(yhat)
        return yhat, 200

    else:
        s = 'please check the flag value given'
        return s, 200
