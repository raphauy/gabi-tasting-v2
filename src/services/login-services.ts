import { prisma } from "@/lib/db"
import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    code: z.optional(z.string()),
});
  
export async function getOTPConfirmationByUserIdAndDeviceId(userId: string, deviceId: string) {
    
    const otpConfirmation = await prisma.oTPConfirmation.findUnique({
        where: {
            userId_deviceId: {
                userId,
                deviceId
            }
        }
    });

    return otpConfirmation;
}

export async function createOTPConfirmation(data: {
  userId: string;
  deviceId: string;
  deviceName?: string;
  ipAddress?: string;
}) {
  return prisma.oTPConfirmation.create({
    data: {
      ...data,
      lastUsed: new Date()
    }
  });
}

export async function deleteOTPConfirmation(id: string) {
    
    const otpConfirmation = await prisma.oTPConfirmation.delete({
        where: {
            id
        }
    });

    return otpConfirmation;
}

  



/**
 * 
 * OTPCode functions
 *  
 */

export async function generateOTPCode(email: string) {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);
  
    const existingToken = await getOTPCodeByEmail(email)
  
    if (existingToken) {
      await deleteOTPCode(existingToken.id)
    }
  
    const oTPCode = await createOTPCode(email, token, expires)
  
    return oTPCode
}

// DB OTPCode functions

export async function getOTPCodeByEmail(email: string) {
    const oTPCode = await prisma.oTPCode.findFirst({
        where: { 
            email 
        }
    })

    return oTPCode
}

export async function createOTPCode(email: string, code: string, expires: Date) {
    const oTPCode = await prisma.oTPCode.create({
        data: {
            email,
            code,
            expires
        }
    })

    return oTPCode
}

export async function deleteOTPCode(id: string) {
    const oTPCode = await prisma.oTPCode.delete({
        where: {
            id
        }
    })

    return oTPCode
}

/**
 * User functions
 */
export async function setUserAsVerified(userId: string) {
    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            emailVerified: new Date(),
        }
    })

    return user
}

export const getUserByEmail = async (email: string) => {
    try {
        console.log("getUserByEmail", email)
        
        const user = await prisma.user.findUnique({ where: { email } })

        console.log("user", user)
        

        return user
    } catch {
        return null
    }
};
  
  export const getUserById = async (id: string) => {
    try {
        console.log("getUserById", id)
        
        const user = await prisma.user.findUnique({ 
            where: { 
                id 
            },
        })

        return user
    } catch {
        return null
    }
};

export async function getOTPConfirmationByUserIdAndDevice(
  userId: string, 
  deviceId: string
) {
  return prisma.oTPConfirmation.findUnique({
    where: {
      userId_deviceId: {
        userId,
        deviceId
      }
    }
  });
}

export async function getActiveConfirmations(userId: string) {
  return prisma.oTPConfirmation.findMany({
    where: {
      userId,
      lastUsed: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    },
    orderBy: {
      lastUsed: 'desc'
    }
  });
}


