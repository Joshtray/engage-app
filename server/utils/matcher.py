import pandas as pd
import math
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
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

# def choose_restaurant(choice_index, similarity_df):
#     """
#     Choose a restaurant as the basis for generating recommendations.

#     Parameters:
#     choice_index (int): The index of the restaurant to
#       base recommendations on.
      
#     similarity_df (pd.DataFrame): A DataFrame containing similarity 
#       scores between restaurants and user preferences.

#     Returns:
#     pd.DataFrame: A sorted DataFrame with restaurants ranked by their 
#       similarity to the chosen restaurant.

#     This function takes a restaurant index and a similarity DataFrame 
#       as input and sorts the restaurants in the DataFrame by their 
#       similarity score to the chosen restaurant. The result is a 
#       DataFrame where restaurants are ranked by their similarity to 
#       the chosen restaurant, with the most similar restaurants at the 
#       top.

#     Example:
#     >>> recommendations = choose_restaurant(5, similarity_df)
#     """
#     # Sort restaurants by similarity score for this user
#     similarity_df = similarity_df.sort_values(by=choice_index, 
#                                               ascending=False)
#     similarity_df

# def determine_cuisine(choice_index):
#     """
#     Determine the cuisine type based on a chosen restaurant.

#     Parameters:
#     choice_index (int): The index of the restaurant used to 
#         determine the cuisine.

#     Returns:
#     str: The cuisine type of the chosen restaurant.

#     This function calculates the cuisine type based on 
#         a chosen restaurant's index.
#     It adjusts the index and extracts the cuisine type 
#         from the DataFrame. The cuisine
#     type is then printed as a craving and returned.

#     Example:
#     >>> cuisine = determine_cuisine(5)
#     >>> print(f"I'm craving {cuisine}")
#     I'm craving Italian
#     """
#     # Adjust the choice index
#     choice_index = 142 + choice_index - 2

#     # Get the cuisine type of the chosen restaurant
#     cuisine_type = df_copy.iloc[choice_index]['cuisine']

#     # Print the craving and return the cuisine type
#     print(f"I'm craving {cuisine_type}")
#     print('\n')
#     return cuisine_type

# def cuisine_recommendations(cuisine_type, total_no_of_recommendations, 
#                             recommended_list):
#     """
#     Generate restaurant recommendations based on cuisine similarity.

#     This function takes a cuisine type, 
#         the total number of recommendations desired, 
#         and a list of recommended restaurants.
#     It finds restaurants of the specified cuisine in 
#         the most similar restaurant list.

#     Args:
#     - cuisine_type (str): The target cuisine type.
#     - total_no_of_recommendations (int): Total 
#         number of recommendations needed.
#     - recommended_list (list): A list to store 
#         the recommended restaurant indices.

#     Returns:
#     - recommended_list (list): A list of recommended restaurant indices.
#     - count (int): The number of recommendations found.
#     """
#     # Calculate the number of recommendations for the same cuisine
#     similar_cuisine_recs = math.ceil(total_no_of_recommendations / 2) 

#     # Get the index of the top similar restaurants
#     top_restaurants = similarity_df.index
#     count = 0

#     # Iterate through the top restaurants and check their cuisine
#     for restaurant_index in top_restaurants:

#         # Access the cuisine of the restaurant from 
#         # the original DataFrame
#         cuisine = df.iloc[restaurant_index] 

#         # Check if the restaurant has the specific cuisine 
#         # (assuming the cuisine column is a boolean)
#         # Check the restaurant hasn't been reviewed by user
#         # indices less than 141 haven't been reviewed by user
#         if cuisine[cuisine_type] == 1 and restaurant_index < 141:
#             recommended_list.append(restaurant_index)
#             count += 1

#             # Break the loop if we have reached the desired 
#             # number of similar cuisine recommendations
#             if count >= similar_cuisine_recs:
#                 break

#     return recommended_list, count

# def diverse_recommendations(cuisine_type, total_no_of_recommendations, 
#                             recommended_list, count):
#     """
#     Generate diverse restaurant recommendations.

#     This function takes a cuisine type, 
#         the total number of recommendations desired, 
#         a list of recommended restaurants, and a count.
#     It finds restaurants of different cuisines that 
#         haven't been reviewed by the user from the most
#         similar restaurant list.

#     Args:
#     - cuisine_type (str): The target cuisine type.
#     - total_no_of_recommendations (int): 
#         Total number of recommendations needed.
#     - recommended_list (list): 
#         A list to store the recommended restaurant indices.
#     - count (int): The number of recommendations found so far.

#     Returns:
#     - recommended_list (list): A list of recommended restaurant indices.
#     """
#     # Get the index of the top similar restaurants
#     diverse_recs = similarity_df.index 

#     # Iterate through the top restaurants and check their cuisine
#     for restaurant_index in diverse_recs:
#         # Access the cuisine of the restaurant from 
#         # the original DataFrame
#         cuisine = df.iloc[restaurant_index]

#         # Check if the restaurant has a different cuisine 
#         # (assuming the cuisine column is a boolean)
#         # Check the restaurant hasn't been reviewed by the user 
#         # (indices less than 141 haven't been reviewed)
#         if cuisine[cuisine_type] != 1 and restaurant_index < 141:
#             recommended_list.append(restaurant_index)
#             count += 1

#             # Break the loop if we have reached the desired number of 
#             # diverse recommendations
#             if count >= total_no_of_recommendations:
#                 break

#     return recommended_list

# def get_recommendations(choice_index, total_no_of_recommendations):
#     """
#     Get restaurant recommendations based on choice and cuisine.

#     This function takes a choice index and the total number of 
#         recommendations desired. 
#         It selects a restaurant, determines its cuisine, 
#         and then generates a list of recommendations 
#         based on that cuisine and diversity criteria.

#     Args:
#     - choice_index (int): The index of the chosen restaurant.
    
#     - total_no_of_recommendations (int): Total number of 
#         recommendations needed.

#     Returns:
#     None
#     """
#     # Choose a restaurant and sort the dataframe
#     choose_restaurant(choice_index, similarity_df)

#     # Determine the cuisine type of the chosen restaurant
#     cuisine_type = determine_cuisine(choice_index)

#     # initialise list to append indices of recommended restaurants
#     recommended_list = []
#     recommended_list, count = cuisine_recommendations(cuisine_type,
#                 total_no_of_recommendations, recommended_list)
#     recommended_list = diverse_recommendations(cuisine_type, 
#                 total_no_of_recommendations, recommended_list, count)

#     # Iterate through the recommended list 
#     # and print details of each restaurant
#     for r in range(len(recommended_list)):
#         restaurant = df_copy.iloc[recommended_list[r]]
#         print(f'Recommendation {r+1}:')
#         print(f'Name: {restaurant["name"]}')
#         print(f'Cuisine: {restaurant["cuisine"]}')
#         print(f'Price Range: {restaurant["price_range"]}')
#         print(f'Rating: {restaurant["rating"]}')
#         print(f'Number of Reviews: {restaurant["no_of_reviews"]}')
#         print(f'Description: {restaurant["description"]}\n')

# choice_index = 37
# total_no_of_recommendations = 8
# get_recommendations(choice_index,total_no_of_recommendations)