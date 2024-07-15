const mailtemplate = (issue) => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <style>
        .container {
            width: 100%;
            background-color: #FF5733;
            padding: 20px;
            border-radius: 8px;
            box-sizing: border-box;
            overflow: hidden;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .flex-container {
            display: flex;
            flex-wrap: wrap;
            color: white;
        }

        .image-container {
            flex: 0 0 35%;
            max-width: 35%;
            position: relative;
            padding-right: 20px;
        }

        .image-container img {
            aspect-ratio: 6 / 9;
            width: 100%;
            max-width: 300px;
            height: auto;
            max-height: 250px;
            object-fit: cover;
            border-radius: 8px;
            display: block;
        }

        .text-container {
            flex: 0 0 65%;
            max-width: 65%;
        }

        h6 {
            font-size: 32px;
            margin: 0;
            margin-bottom: 5px;
        }

        p {
            font-size: 16px;
            margin: 0;
            margin-bottom: 5px;
        }

        .capsule {
            display: inline-block;
            padding: 5px 15px;
            border: 1px solid white;
            border-radius: 25px;
            font-size: 16px;
            margin-bottom: 10px;
        }

        @media (max-width: 600px) {
            .container {
                padding: 10px;
                margin-top: 20px;
                margin-bottom: 20px;
            }

            .image-container {
                flex: 0 0 50%;
                max-width: 50%;
                padding-right: 10px;
            }

            .image-container img {
                max-width: 50vw;
                max-height: 300px;
            }

            .text-container {
                flex: 0 0 50%;
                max-width: 50%;
                padding-left: 10px;
                margin-top: 10px;
            }

            h6 {
                font-size: 21px;
            }

            p {
                font-size: 13px;
            }

            .capsule {
                font-size: 13px;
            }
        }
    </style>
</head>

<body>
    <p>Hello ${issue.user_name},</p>
    <p>This is a reminder to return the book "${issue.book_title}". It was issued on ${new Date(issue.issue_date).toDateString()} with return on ${new Date().toDateString()}.</p>
    <a href="${process.env.FRONTEND}/student/${issue.book_id}" style="text-decoration: none; color: inherit;">
        <div class="container">
            <div class="flex-container">
                <div class="image-container">
                    <img src="${issue.book_cover_img}" alt="" onerror="this.style.display='none'; this.onerror=null;">
                </div>
                <div class="text-container">
                    <h6>${issue.book_title}</h6>
                    <div class="capsule">${issue.book_genre}</div>
                    <p>${issue.book_description}</p>
                </div>
            </div>
        </div>
    </a>
    <p style="margin-top: 20px;">Thank you!<br>AutoLib Admin</p>
</body>

</html>
`};

export default mailtemplate;
