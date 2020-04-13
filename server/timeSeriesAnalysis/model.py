import numpy as np
import pandas as pd
from pandas import read_csv
from matplotlib import pyplot
from statsmodels.graphics.tsaplots import plot_pacf, plot_acf
from statsmodels.tsa.arima_model import ARIMA
import statsmodels.api as sm
import pandas as pd
from sklearn.metrics import mean_squared_error


# Dataset init

Foreign_Exchange_Rates = pd.read_csv("./dataset.csv")
df = Foreign_Exchange_Rates[['Time Serie',
                             'AUSTRALIA - AUSTRALIAN DOLLAR/US$']]

gdf = df[df['AUSTRALIA - AUSTRALIAN DOLLAR/US$'] == 'ND']
df = pd.concat([df, gdf, gdf]).drop_duplicates(keep=False)

df.rename(columns={'Time Serie': 'index'}, inplace=True)
df.rename(columns={'AUSTRALIA - AUSTRALIAN DOLLAR/US$': 'value'}, inplace=True)

# ARIMA model

model = ARIMA(pd.DataFrame(df.value.astype(float)), order=(1, 0, 0))
model_fit = model.fit(disp=0)
print(model_fit.summary())

df = pd.DataFrame(df.value.astype(float))

X = df.value
size = int(len(X) * 0.66)
train, test = X[0:size], X[size:len(X)]
history = [x for x in train]
test1 = [y for y in test]
predictions = list()
for t in range(len(test)):
    model = ARIMA(history, order=(1, 0, 0))
    model_fit = model.fit(disp=0)
    output = model_fit.forecast()
    yhat = output[0]
    predictions.append(yhat)
    print(yhat)
    obs = test1[t]
    history.append(obs)
    print('predicted=%f, expected=%f' % (yhat, obs))
error = mean_squared_error(test, predictions)
print('Test MSE: %.3f' % error)

# plot
# pyplot.plot(test)
# pyplot.plot(predictions, color='red')
# pyplot.show()
