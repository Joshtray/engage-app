import os

try:
    import pandas as pd
except ImportError:
    os.system('pip install pandas')
finally:
    import pandas as pd

try:
    from sklearn.metrics.pairwise import cosine_similarity
except ImportError:
    os.system('pip install scikit-learn')
finally:
    from sklearn.metrics.pairwise import cosine_similarity

import sys
import json

# print('# Hello from python #')

# Load the data
user_id = sys.argv[1]
data = json.loads(sys.argv[2])
tags = json.loads(sys.argv[3])

# Create a dictionary to map user IDs to their interests
user_interests = {}
for user in data:
    interests = [1 if tag_id in user['interests'] else 0 for tag_id in tags]
    user_interests[user['_id']] = interests

# Create a DataFrame from the dictionary
df = pd.DataFrame.from_dict(user_interests, orient='index', columns=tags).reset_index()
df.columns = ['user_id'] + tags

# PATH = './user_data.csv'
# import data
# df = pd.read_csv(PATH)
df.head()

# Determine index of user in DataFrame from user_id
user_index = df[df['user_id'] == user_id].index[0]

# def one_hot_encode(df, columns):
#     # Perform one-hot encoding on the specified columns
#     one_hot_encoded_df = pd.get_dummies(df[columns], dtype='int64')

#     # Reset the index of the one-hot encoded DataFrame
#     one_hot_encoded_df.reset_index(drop=True, inplace=True)

#     # Concatenate the one-hot encoded DataFrame with the original DataFrame
#     return pd.concat([df, one_hot_encoded_df], axis=1).drop(columns=columns)

# df = one_hot_encode(df, columns=['job_title', 'team', 'org']).fillna(0)

# Filter the DataFrame based on the desired user_id
df = df.drop(columns=['user_id'])
user_profile = df.loc[df.index == user_index]


# Calculate cosine similarity between user's preferences and all other users
similarity_scores = cosine_similarity(user_profile, df)


# Create a DataFrame to store similarity scores for the user
similarity_df = pd.DataFrame(similarity_scores, columns=df.index).transpose()

# Sort users by similarity score
similarity_df = similarity_df.sort_values(by=0, ascending=False).drop(index=user_index)
# print(similarity_df)

# Recommend the id of the most similar user
match_id = data[similarity_df.index[0]]['_id']
print(match_id)