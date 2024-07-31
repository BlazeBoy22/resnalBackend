import pandas as pd

# Path to your input Excel file
input_excel_file = 'student_marks.xlsx'
output_excel_file = 'toppers.xlsx'

# Columns to be included in the output (0-based index)
columns_to_include = [0, 1, 2, -1]  # Columns 1, 2, 3 and the last column

try:
    # Read the Excel file into a pandas DataFrame
    df = pd.read_excel(input_excel_file)
    
    # Select only the desired columns
    selected_columns = df.iloc[:, columns_to_include]
    
    # Sort by the last column (assuming it's the last column in selected_columns)
    sorted_df = selected_columns.sort_values(by=selected_columns.columns[-1], ascending=False)
    
    # Find the first null row after row 2
    first_null_row = None
    for index, row in sorted_df.iloc[2:].iterrows():
        if row.isnull().any():
            if(index != 0):
                first_null_row = index+1
                break
    
    if first_null_row is not None:
        print(f"First null row after row 2 is found at index {first_null_row}:")
        # print(sorted_df.loc[first_null_row])
    else:
        print("No null rows found after row 2.")
    
    sorted_df = sorted_df[:first_null_row]

    # Write the sorted DataFrame to a new Excel file
    sorted_df.to_excel(output_excel_file, index=False)
    print(f"Excel file with selected columns and sorted rows saved successfully: {output_excel_file}")

except FileNotFoundError:
    print(f"File not found: {input_excel_file}")
except Exception as e:
    print(f"An error occurred: {str(e)}")
